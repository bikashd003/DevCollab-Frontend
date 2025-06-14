import React, { useState, useEffect } from 'react';
import type { MultiValue } from 'react-select';
import Select from 'react-select';
import { motion } from 'framer-motion';
import { FiX, FiFilter } from 'react-icons/fi';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterProps {
  filterType: string;
  options: FilterOption[];
  onFilterChange: (selectedValues: string[]) => void;
}

const Filter: React.FC<FilterProps> = ({ filterType, options, onFilterChange }) => {
  const handleChange = (selectedOptions: MultiValue<FilterOption>) => {
    const values = selectedOptions.map(option => option.value);
    onFilterChange(values);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <label
        htmlFor={filterType}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize"
      >
        {filterType}
      </label>
      <Select
        id={filterType}
        options={options}
        isMulti
        onChange={handleChange}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder={`Select ${filterType}...`}
        styles={{
          control: (provided, state) => ({
            ...provided,
            backgroundColor: 'transparent',
            borderColor: state.isFocused ? 'rgb(34 197 94)' : 'rgb(209 213 219)',
            borderRadius: '0.5rem',
            minHeight: '42px',
            boxShadow: state.isFocused ? '0 0 0 1px rgb(34 197 94)' : 'none',
            color: 'rgb(55 65 81)',
            '&:hover': {
              borderColor: 'rgb(34 197 94)',
            },
            '@media (prefers-color-scheme: dark)': {
              borderColor: state.isFocused ? 'rgb(34 197 94)' : 'rgb(75 85 99)',
              color: 'rgb(229 231 235)',
            },
          }),
          menu: provided => ({
            ...provided,
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            border: '1px solid rgb(229 231 235)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            '@media (prefers-color-scheme: dark)': {
              backgroundColor: 'rgb(31 41 55)',
              borderColor: 'rgb(75 85 99)',
            },
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
              ? 'rgb(34 197 94)'
              : state.isFocused
                ? 'rgb(240 253 244)'
                : 'transparent',
            color: state.isSelected ? 'white' : 'rgb(55 65 81)',
            '&:hover': {
              backgroundColor: state.isSelected ? 'rgb(34 197 94)' : 'rgb(240 253 244)',
            },
            '@media (prefers-color-scheme: dark)': {
              color: state.isSelected ? 'white' : 'rgb(229 231 235)',
              backgroundColor: state.isSelected
                ? 'rgb(34 197 94)'
                : state.isFocused
                  ? 'rgb(75 85 99)'
                  : 'transparent',
              '&:hover': {
                backgroundColor: state.isSelected ? 'rgb(34 197 94)' : 'rgb(75 85 99)',
              },
            },
          }),
          multiValue: provided => ({
            ...provided,
            backgroundColor: 'rgb(240 253 244)',
            borderRadius: '0.375rem',
          }),
          multiValueLabel: provided => ({
            ...provided,
            color: 'rgb(34 197 94)',
            fontWeight: '500',
          }),
          multiValueRemove: provided => ({
            ...provided,
            color: 'rgb(34 197 94)',
            '&:hover': {
              backgroundColor: 'rgb(34 197 94)',
              color: 'white',
            },
          }),
        }}
        theme={theme => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: 'rgb(34 197 94)',
            primary75: 'rgb(34 197 94)',
            primary50: 'rgb(240 253 244)',
            primary25: 'rgb(240 253 244)',
          },
        })}
      />
    </motion.div>
  );
};

interface FiltersContainerProps {
  filters: {
    [key: string]: FilterOption[];
  };
  onFiltersChange: (filters: { [key: string]: string[] }) => void;
}

const FiltersContainer: React.FC<FiltersContainerProps> = ({ filters, onFiltersChange }) => {
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({});
  const [selectedFilterType, setSelectedFilterType] = useState<string | null>(null);

  const handleFilterChange = (filterType: string, selectedValues: string[]) => {
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: selectedValues,
    }));
  };

  const clearFilter = (filterType: string) => {
    setSelectedFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      delete newFilters[filterType];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setSelectedFilterType(null);
  };

  useEffect(() => {
    onFiltersChange(selectedFilters);
  }, [selectedFilters, onFiltersChange]);

  const filterTypeOptions = Object.keys(filters).map(filterType => ({
    value: filterType,
    label: filterType.charAt(0).toUpperCase() + filterType.slice(1),
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <FiFilter className="text-emerald-600" />
          Filters
        </h2>
        {Object.keys(selectedFilters).length > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors duration-200 flex items-center gap-1"
          >
            <FiX size={14} />
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="filterType"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Filter Category
          </label>
          <Select
            id="filterType"
            options={filterTypeOptions}
            onChange={option => {
              setSelectedFilterType(option ? option.value : null);
            }}
            value={filterTypeOptions.find(option => option.value === selectedFilterType)}
            className="basic-single"
            classNamePrefix="select"
            placeholder="Choose a filter category..."
            styles={{
              control: (provided, state) => ({
                ...provided,
                backgroundColor: 'transparent',
                borderColor: state.isFocused ? 'rgb(34 197 94)' : 'rgb(209 213 219)',
                borderRadius: '0.5rem',
                minHeight: '42px',
                boxShadow: state.isFocused ? '0 0 0 1px rgb(34 197 94)' : 'none',
                color: 'rgb(55 65 81)',
                '&:hover': {
                  borderColor: 'rgb(34 197 94)',
                },
                '@media (prefers-color-scheme: dark)': {
                  borderColor: state.isFocused ? 'rgb(34 197 94)' : 'rgb(75 85 99)',
                  color: 'rgb(229 231 235)',
                },
              }),
              menu: provided => ({
                ...provided,
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                border: '1px solid rgb(229 231 235)',
                boxShadow:
                  '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                '@media (prefers-color-scheme: dark)': {
                  backgroundColor: 'rgb(31 41 55)',
                  borderColor: 'rgb(75 85 99)',
                },
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected
                  ? 'rgb(34 197 94)'
                  : state.isFocused
                    ? 'rgb(240 253 244)'
                    : 'transparent',
                color: state.isSelected ? 'white' : 'rgb(55 65 81)',
                '@media (prefers-color-scheme: dark)': {
                  color: state.isSelected ? 'white' : 'rgb(229 231 235)',
                  backgroundColor: state.isSelected
                    ? 'rgb(34 197 94)'
                    : state.isFocused
                      ? 'rgb(75 85 99)'
                      : 'transparent',
                },
              }),
            }}
            theme={theme => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: 'rgb(34 197 94)',
              },
            })}
          />
        </div>

        {selectedFilterType && (
          <Filter
            key={selectedFilterType}
            filterType={selectedFilterType}
            options={filters[selectedFilterType]}
            onFilterChange={selectedValues =>
              handleFilterChange(selectedFilterType, selectedValues)
            }
          />
        )}

        {/* Active Filters Display */}
        {Object.keys(selectedFilters).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4"
          >
            <h3 className="text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-3 flex items-center gap-2">
              <FiFilter size={14} />
              Active Filters
            </h3>
            <div className="space-y-2">
              {Object.entries(selectedFilters).map(([filterType, values]) => (
                <div key={filterType} className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 capitalize">
                      {filterType}:
                    </span>
                    {values.map((value, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => clearFilter(filterType)}
                    className="text-emerald-600 hover:text-red-500 transition-colors duration-200"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FiltersContainer;
