import { Filter, Search} from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import {ChevronDown, ChevronUp, FunnelX} from "lucide-react";

const FilterComponent = ({filters, handleFilterChange, onClear}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [sortStates, setSortStates] = useState({});

  const toggleSort = (field) => {
    let newDirection = sortStates[field] === "asc" ? "desc" : "asc";
    setSortStates((prev) => ({ ...prev, [field]: newDirection }));
    handleFilterChange(field, newDirection);
  };

  const clearFilters = () => {
    setSortStates({});
    onClear?.(); 
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center mt-4 z-10">
          <div className={`flex items-center lg:justify-between space-x-6 overflow-hidden transition-all duration-300 ${showFilters ? "max-h-96 pb-4" : "max-h-0"}`}>
            {
              filters.map((filter, index) => (
                <button
                  key={index}
                  onClick={() => toggleSort(filter.value)}
                  className="flex items-center justify-between space-x-4 w-full p-4 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 mb-2 
                  transition-colors"
                  >
                  <span className="flex items-center">
                    {filter.label}
                  </span>
                  {sortStates[filter.value] === "asc" ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
              ))
            }
            
          </div>
          <div className="flex items-center space-x-2 mb-4">
            
            <button
            onClick={() => setShowFilters(!showFilters)}
            className="sticky p-2 rounded-lg bg-amber-500 hover:bg-gray-600 text-gray-200 transition-colors">
                <Filter size={20} />
            </button>
            <button
            onClick={() => clearFilters()}
            className={`${showFilters? "": "hidden"} sticky p-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-gray-200 transition-colors`}>
                <FunnelX size={20} />
            </button>
          </div>
      </div>
    </>
  );
}

FilterComponent.defaultProps = {
  filters: [],
  handleFilterChange: () => {}
}

FilterComponent.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.string),
  handleFilterChange: PropTypes.func
};

export default FilterComponent