import { useEffect, useState, useMemo, useContext } from "react";
import { useLocation } from "react-router-dom";

import API from "../../../api/axios";
import Spinner from "../../../features/components/common/Spinner";
import InsurancePlanTable from "../components/InsurancePlanTable";
import columnConfig from "../utils/columnConfig";
import PlanToolbar from "../../../features/components/common/PlanToolbar";
import { exportToExcel } from "../../../utils/exportToExcel";
import { FacilityContext } from "../../../features/components/context/FacilityContext";
import useColumnOrder from "../../../features/plans/hooks/useColumnOrder"; // assumes you added this hook

const InsurancePlanMainPage = ({ setExportHandler }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // searches
  const [searchQuery, setSearchQuery] = useState("");
  const [prefixQuery, setPrefixQuery] = useState("");

  // column UI
  const [columnSettingsOpen, setColumnSettingsOpen] = useState(false);

  // table UI
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // theme + route
  const { facilityTheme } = useContext(FacilityContext);
  const location = useLocation();

  const filterMap = {
    "/plans": "All",
    "/plans/medicare": "Medicare",
    "/plans/medicaid": "Medicaid/Medi-Cal",
    "/plans/commercial": "Commercial",
  };
  const currentFilter = filterMap[location.pathname] || "All";
  const itemsPerPage = 10;

  // visibility (persisted)
  const [tableColumns, setTableColumns] = useState(() => {
    const saved = localStorage.getItem("visibleTableColumns");
    if (saved) return JSON.parse(saved);
    const initial = {};
    columnConfig.forEach((col) => (initial[col.key] = true));
    return initial;
  });

  // order (persisted)
  const allKeys = useMemo(() => columnConfig.map((c) => c.key), []);
  const { order, setOrder, resetOrder } = useColumnOrder(allKeys);

  // toast
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info");
  const [showToast, setShowToast] = useState(false);
  const [animateToast, setAnimateToast] = useState(false);

  const showToastMessage = (message, type = "info") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setAnimateToast(true);
    setTimeout(() => setAnimateToast(false), 2600);
    setTimeout(() => setShowToast(false), 3000);
  };

  const toggleColumn = (key) => {
    const updated = { ...tableColumns, [key]: !tableColumns[key] };
    setTableColumns(updated);
    localStorage.setItem("visibleTableColumns", JSON.stringify(updated));
  };

  const resetColumns = () => {
    const def = {
      descriptiveName: true,
      financialClass: true,
      prefix: true,
      planName: true,
      planCode: true,
      samcContracted: true,
      samfContracted: true,
      image: true,
      secondaryImage: true,
    };
    columnConfig.forEach((col) => {
      if (!(col.key in def)) def[col.key] = false;
    });
    setTableColumns(def);
    localStorage.setItem("visibleTableColumns", JSON.stringify(def));
    showToastMessage("Table view reset to default", "info");
  };

  const restoreAllColumns = () => {
    const all = {};
    columnConfig.forEach((c) => (all[c.key] = true));
    setTableColumns(all);
    localStorage.setItem("visibleTableColumns", JSON.stringify(all));
    showToastMessage("Table view: All columns restored", "success");
  };

  // fetch
  useEffect(() => {
    const fetchBooks = async () => {
      const activeFacility = localStorage.getItem("activeFacility");
      if (!activeFacility) return;

      try {
        const res = await API.get(
          `/books?facility=${encodeURIComponent(activeFacility)}`
        );
        setBooks(res.data.data);
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchBooks();
  }, []);

  // filtered
  const filteredBooks = useMemo(() => {
    let result = books
      // 1) class filter
      .filter((book) => {
        const fc = book.financialClass?.toLowerCase() || "";
        if (currentFilter === "Medicare") return fc.includes("medicare");
        if (currentFilter === "Medicaid/Medi-Cal")
          return fc.includes("medi-cal") || fc.includes("medicaid");
        if (currentFilter === "Commercial") return fc.includes("commercial");
        return true;
      })
      // 2) prefix-only filter
      .filter((book) => {
        const q = prefixQuery.trim().toLowerCase();
        if (!q) return true;
        const prefixes = (book.prefixes || []).map((p) =>
          (p?.value || "").toLowerCase()
        );
        return prefixes.some((p) => p.includes(q)); // or startsWith(q)
      })
      // 3) global search (includes prefixes)
      .filter((book) => {
        const search = searchQuery.trim().toLowerCase();
        if (!search) return true;

        // tokenized matching: "blue cross sante" → finds "Anthem Blue Cross IPA SANTE"
        const tokens = search.split(/\s+/).filter(Boolean);

        const haystack = [
          ...Object.values(book).map((v) => String(v).toLowerCase()),
          book.facilityAddress?.street?.toLowerCase() || "",
          book.facilityAddress?.city?.toLowerCase() || "",
          book.facilityAddress?.state?.toLowerCase() || "",
          book.facilityAddress?.zip?.toLowerCase() || "",
          book.providerAddress?.street?.toLowerCase() || "",
          book.providerAddress?.city?.toLowerCase() || "",
          book.providerAddress?.state?.toLowerCase() || "",
          book.providerAddress?.zip?.toLowerCase() || "",
          ...(book.prefixes || []).map((p) => p?.value?.toLowerCase() || ""), // ✅ include prefixes here
          ...(book.portalLinks || []).flatMap((l) => [
            l.title?.toLowerCase() || "",
            l.url?.toLowerCase() || "",
          ]),
          ...(book.phoneNumbers || []).flatMap((p) => [
            p.title?.toLowerCase() || "",
            p.number?.toLowerCase() || "",
          ]),
        ].join(" ");

        return tokens.every((t) => haystack.includes(t));
      });

    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key]?.toString().toLowerCase() || "";
        const bVal = b[sortConfig.key]?.toString().toLowerCase() || "";
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result.map((book) => ({
      ...book,
      facilityContracts: book.facilityContracts || [],
    }));
  }, [books, searchQuery, prefixQuery, currentFilter, sortConfig]);

  // pagination
  const paginatedBooks = useMemo(() => {
    if (showAll) return filteredBooks;
    return filteredBooks.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredBooks, currentPage, itemsPerPage, showAll]);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  // reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, prefixQuery, currentFilter]);

  // export hook
  useEffect(() => {
    if (!setExportHandler) return;
    setExportHandler(() => () => {
      exportToExcel(filteredBooks, columnConfig, "InsurancePlans.xlsx");
    });
  }, [filteredBooks, setExportHandler]);

  return (
    <>
      <PlanToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        prefixQuery={prefixQuery}
        setPrefixQuery={setPrefixQuery}
        columnConfig={columnConfig}
        visibleColumns={tableColumns}
        toggleColumn={toggleColumn}
        columnSettingsOpen={columnSettingsOpen}
        setColumnSettingsOpen={setColumnSettingsOpen}
        resetColumns={resetColumns}
        restoreAllColumns={restoreAllColumns}
        order={order}
        setOrder={setOrder}
        onResetOrder={resetOrder}
      />

      <div>
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner />
          </div>
        ) : (
          <InsurancePlanTable
            books={paginatedBooks}
            visibleColumns={tableColumns}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            searchQuery={searchQuery}
            prefixQuery={prefixQuery}
            order={order}
            columnConfig={columnConfig}
          />
        )}
      </div>

      {!loading && !showAll && filteredBooks.length > itemsPerPage && (
        <nav className="d-flex justify-content-center mt-3">
          <ul className="pagination pagination-sm">
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i} className="page-item">
                <button
                  className={`page-link ${i + 1 === currentPage ? "text-white" : ""}`}
                  style={{
                    backgroundColor:
                      i + 1 === currentPage
                        ? facilityTheme.primaryColor
                        : "transparent",
                    borderColor: facilityTheme.primaryColor,
                  }}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Toast */}
      {showToast && (
        <div
          className={`toast show position-fixed shadow-lg ${
            animateToast ? "toast-animate-in" : "toast-animate-out"
          }`}
          role="alert"
          style={{
            bottom: "50px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            minWidth: "300px",
            maxWidth: "90vw",
            borderRadius: "0.5rem",
            overflow: "hidden",
            transition: "opacity 0.4s ease, transform 0.4s ease",
            opacity: animateToast ? 1 : 0,
          }}
        >
          <div
            className="toast-header text-white justify-content-center"
            style={{
              backgroundColor: toastType === "success" ? "#28a745" : "#005b7f",
            }}
          >
            <strong className="me-auto">Settings Updated</strong>
          </div>
          <div className="toast-body text-center">{toastMessage}</div>
        </div>
      )}

      <div className="text-end m-2">
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Paginate Results" : "Show All"}
        </button>
      </div>
    </>
  );
};

export default InsurancePlanMainPage;
