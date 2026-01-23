import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [activeStatus, setActiveStatus] = useState('Tous');
    const [activeType, setActiveType] = useState('Tous');
    const [activeCities, setActiveCities] = useState([]);
    const [activeBudget, setActiveBudget] = useState('');
    const [activeMinSurface, setActiveMinSurface] = useState('');
    const [activeMinRooms, setActiveMinRooms] = useState('');
    const [activeFeatures, setActiveFeatures] = useState([]);
    const [showFilteredResults, setShowFilteredResults] = useState(false);

    const resetFilters = () => {
        setActiveStatus('Tous');
        setActiveType('Tous');
        setActiveCities([]);
        setActiveBudget('');
        setActiveMinSurface('');
        setActiveMinRooms('');
        setActiveFeatures([]);
        setShowFilteredResults(false);
    };

    const value = {
        activeStatus, setActiveStatus,
        activeType, setActiveType,
        activeCities, setActiveCities,
        activeBudget, setActiveBudget,
        activeMinSurface, setActiveMinSurface,
        activeMinRooms, setActiveMinRooms,
        activeFeatures, setActiveFeatures,
        showFilteredResults, setShowFilteredResults,
        resetFilters
    };

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};
