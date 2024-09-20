import React, { useState, useEffect } from 'react';
import type { MultiValue } from 'react-select';
import Select from 'react-select';

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
    <div className="mb-4">
      <label htmlFor={filterType} className="block text-sm font-medium text-gray-700 mb-1">
        {filterType}
      </label>
      <Select
        id={filterType}
        options={options}
        isMulti
        onChange={handleChange}
        className="basic-multi-select"
        classNamePrefix="select"
      />
    </div>
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

  useEffect(() => {
    onFiltersChange(selectedFilters);
  }, [selectedFilters, onFiltersChange]);

  const filterTypeOptions = Object.keys(filters).map(filterType => ({
    value: filterType,
    label: filterType,
  }));

  return (
    <div className="col-span-12 md:col-span-6 p-4 bg-background text-foreground dark:bg-dark-background dark:text-dark-foreground dark:border rounded-lg w-full">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      <div className="mb-4">
        <label htmlFor="filterType" className="block text-sm font-medium text-gray-700 mb-1">
          Select Filter Type
        </label>
        <Select
          id="filterType"
          options={filterTypeOptions}
          onChange={option => {
            setSelectedFilterType(option ? option.value : null);
            setSelectedFilters({});
          }}
          className="basic-single"
          classNamePrefix="select"
        />
      </div>
      {selectedFilterType && (
        <Filter
          key={selectedFilterType}
          filterType={selectedFilterType}
          options={filters[selectedFilterType]}
          onFilterChange={selectedValues => handleFilterChange(selectedFilterType, selectedValues)}
        />
      )}
      <div className="mt-4 p-3 rounded border border-gray-300">
        <pre className="text-sm text-gray-300 font-mono">
          {JSON.stringify(selectedFilters, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default FiltersContainer;
