// src/features/components/common/PlanToolbar.jsx
import { useRef, useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FacilitySelector from '../layout/FacilitySelector';
import { FacilityContext } from '../context/FacilityContext';
import { AuthContext } from '../context/AuthContexts';

/* ---------- Small helper ---------- */
const arrayMove = (arr, from, to) => {
  const a = arr.slice();
  const [moved] = a.splice(from, 1);
  a.splice(to, 0, moved);
  return a;
};

/* ---------- Draggable list to reorder columns ---------- */
const ReorderList = ({ order, setOrder, columnConfig, visibleColumns }) => {
  const dragIndexRef = useRef(null);

  const onDragStart = (e, index) => {
    dragIndexRef.current = index;
    e.dataTransfer.effectAllowed = 'move';
    // Firefox needs setData to initiate HTML5 DnD
    e.dataTransfer.setData('text/plain', String(index));
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (e, overIndex) => {
    e.preventDefault();
    const from =
      dragIndexRef.current ??
      parseInt(e.dataTransfer.getData('text/plain') || '-1', 10);
    if (Number.isNaN(from) || from < 0) return;
    if (from === overIndex) return;
    setOrder((prev) => arrayMove(prev, from, overIndex));
    dragIndexRef.current = null;
  };

  return (
    <ul className="list-unstyled mb-0" style={{ maxHeight: 260, overflowY: 'auto' }}>
      {order.map((key, idx) => {
        const meta = columnConfig.find((c) => c.key === key);
        if (!meta) return null;
        const label = meta.label || key;
        const isVisible = !!visibleColumns[key];

        return (
          <li
            key={key}
            draggable
            onDragStart={(e) => onDragStart(e, idx)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, idx)}
            className="d-flex align-items-center justify-content-between px-2 py-1"
            style={{
              cursor: 'grab',
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              background: isVisible ? '#fff' : '#f8f9fa',
              opacity: isVisible ? 1 : 0.6,
              userSelect: 'none',
              marginBottom: 6,
            }}
            title={isVisible ? 'Drag to reorder' : 'Hidden column (still reorderable)'}
          >
            <span className="d-inline-flex align-items-center gap-2">
              <span
                aria-hidden
                style={{
                  display: 'inline-block',
                  width: 16,
                  textAlign: 'center',
                  fontWeight: 700,
                  color: '#9aa0a6',
                }}
              >
                ≡
              </span>
              <span>{label}</span>
            </span>
            {!isVisible && <span className="badge bg-secondary">Hidden</span>}
          </li>
        );
      })}
    </ul>
  );
};

/* ---------- Main Toolbar ---------- */
const PlanToolbar = ({
  // search
  searchQuery,
  setSearchQuery,
  prefixQuery,
  setPrefixQuery,

  // column visibility
  columnConfig,
  visibleColumns,
  toggleColumn,

  // dropdown state
  columnSettingsOpen,
  setColumnSettingsOpen,

  // visibility reset/show-all
  resetColumns,
  restoreAllColumns,

  // ordering
  order,
  setOrder,
  onResetOrder,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { facility, setFacility, facilityTheme, facilities } = useContext(FacilityContext);
  const { user } = useContext(AuthContext);

  const settingsRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const currentPath = location.pathname;
  const filterMap = {
    '/plans': 'All',
    '/plans/medicare': 'Medicare',
    '/plans/medicaid': 'Medicaid/Medi-Cal',
    '/plans/commercial': 'Commercial',
  };

  /* ---------- Close dropdown on outside click ---------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setColumnSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setColumnSettingsOpen]);

  useEffect(() => {
    if (columnSettingsOpen) {
      setDropdownVisible(true);
    } else {
      const timeout = setTimeout(() => setDropdownVisible(false), 180);
      return () => clearTimeout(timeout);
    }
  }, [columnSettingsOpen]);

  /* ---------- Facility change ---------- */
  const handleFacilityChange = (newFacility) => {
    setFacility(newFacility);
    localStorage.setItem('activeFacility', newFacility);
    window.location.reload(); // keep your current behavior
  };

  /* ---------- Mutually exclusive search bars ---------- */
  const onChangeSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val && prefixQuery) {
      // ensure only one is active; keep UX clear
      setPrefixQuery('');
    }
  };

  const onChangePrefix = (e) => {
    const val = e.target.value;
    setPrefixQuery(val);
    if (val && searchQuery) {
      setSearchQuery('');
    }
  };

  const searchDisabled = !!prefixQuery; // visually indicate exclusivity
  const prefixDisabled = !!searchQuery;

  return (
    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
      {/* LEFT: filter pills + facility selector */}
      <div className="d-flex flex-column" style={{ minWidth: 240 }}>
        {/* Pills */}
        <div
          className="btn-group btn-group-sm mb-2 align-self-start align-self-lg-start align-self-md-start align-self-center"
          role="group"
          aria-label="Insurance Filters"
        >
          {Object.entries(filterMap).map(([path, label], index, array) => (
            <button
              key={path}
              type="button"
              className={`btn fw-semibold px-2 py-1 border ${
                currentPath === path ? 'text-white' : 'text-dark bg-light border-secondary'
              }`}
              style={{
                backgroundColor: currentPath === path ? facilityTheme.primaryColor : undefined,
                fontSize: '0.75rem',
                borderRadius:
                  index === 0
                    ? '5px 0 0 5px'
                    : index === array.length - 1
                    ? '0 5px 5px 0'
                    : '0',
                boxShadow: currentPath === path ? 'inset 0 2px 4px rgba(0,0,0,0.2)' : 'none',
                transition: 'all 0.15s ease-in-out',
              }}
              onClick={() => navigate(path)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Facility selector (only if multiple access) */}
        {user?.facilityAccess?.length > 1 && (
          <div
            className="mt-1 align-self-start align-self-lg-start align-self-md-start align-self-center"
            style={{ maxWidth: 320 }}
          >
            <FacilitySelector
              current={facility}
              available={facilities.filter((fac) => user.facilityAccess.includes(fac.name))}
              onChange={handleFacilityChange}
            />
          </div>
        )}
      </div>

      {/* RIGHT: search + prefix + settings */}
      <div className="d-flex align-items-start gap-2 ms-auto">
        {/* Stacked search inputs */}
        <div className="d-flex flex-column gap-2">
          <div className="d-flex flex-column">
            <input
              type="text"
              placeholder="Search plans…"
              className="form-control form-control-sm"
              value={searchQuery}
              onChange={onChangeSearch}
              disabled={searchDisabled}
              style={{ minWidth: 260, borderRadius: 6, opacity: searchDisabled ? 0.6 : 1 }}
            />
            {searchDisabled && (
              <small className="text-muted">Clear the prefix search to use this.</small>
            )}
          </div>

          <div className="d-flex flex-column">
            <input
              type="text"
              placeholder="Search prefixes only…"
              className="form-control form-control-sm"
              value={prefixQuery}
              onChange={onChangePrefix}
              disabled={prefixDisabled}
              style={{ minWidth: 260, borderRadius: 6, opacity: prefixDisabled ? 0.6 : 1 }}
            />
            {prefixDisabled && (
              <small className="text-muted">Clear the general search to use this.</small>
            )}
          </div>
        </div>

        {/* Column settings */}
        <div className="position-relative">
          <button
            ref={buttonRef}
            className="btn btn-sm fw-semibold"
            style={{
              borderRadius: 6,
              fontSize: '.8rem',
              border: '1px solid #ced4da',
              backgroundColor: columnSettingsOpen ? facilityTheme.primaryColor : '#f8f9fa',
              color: columnSettingsOpen ? 'white' : '#333',
            }}
            onClick={() => setColumnSettingsOpen(!columnSettingsOpen)}
            title="Column settings"
          >
            ⚙️ Columns
          </button>

          {dropdownVisible && (
            <div
              ref={settingsRef}
              className="bg-white shadow p-3 border rounded position-absolute"
              style={{
                top: 'calc(100% + 6px)',
                right: 0,
                zIndex: 9999,
                width: 360,
                maxHeight: '80vh',
                overflowY: 'auto',
                transition: 'opacity 0.18s ease, transform 0.18s ease',
                opacity: columnSettingsOpen ? 1 : 0,
                transform: columnSettingsOpen ? 'translateY(0)' : 'translateY(-8px)',
              }}
            >
              <h6 className="fw-bold mb-2">Visible Columns</h6>
              <div className="mb-3" style={{ columns: 2 }}>
                {columnConfig.map(({ key, label }) => (
                  <div key={key} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`column-toggle-${key}`}
                      checked={!!visibleColumns[key]}
                      onChange={() => toggleColumn(key)}
                    />
                    <label className="form-check-label" htmlFor={`column-toggle-${key}`}>
                      {label}
                    </label>
                  </div>
                ))}
              </div>

              <hr className="my-2" />

              <h6 className="fw-bold mb-2">Reorder Columns</h6>
              <ReorderList
                order={order}
                setOrder={setOrder}
                columnConfig={columnConfig}
                visibleColumns={visibleColumns}
              />

              <hr className="my-2" />

              <div className="d-grid gap-2">
                <button
                  type="button"
                  className="btn btn-outline-info btn-sm"
                  onClick={resetColumns}
                >
                  🔄 Reset Visibility Defaults
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={onResetOrder}
                >
                  ↕ Reset Column Order
                </button>
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm"
                  onClick={restoreAllColumns}
                >
                  🔁 Show All Columns
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile centering tweak */}
      <style>{`
        @media (max-width: 576px) {
          .btn-group[role="group"] { align-self: center !important; }
        }
      `}</style>
    </div>
  );
};

export default PlanToolbar;
