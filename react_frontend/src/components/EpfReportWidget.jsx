import React, { useState, useEffect, useRef } from 'react';
import { Download, User, Calendar, Search, X } from 'lucide-react';
import { getEmployeesApi } from '../apis/employee.api.jsx';

const EPFReportWidget = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [error, setError] = useState('');
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchTerm.length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                const data = await getEmployeesApi({ search: searchTerm });
                setSuggestions(data.data || []);
                setShowSuggestions(true);
            } catch (err) {
                console.error('Error fetching employees:', err);
                setSuggestions([]);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    const handleSelectEmployee = (employee) => {
        setSelectedEmployee(employee);
        setSearchTerm(employee.name);
        setShowSuggestions(false);
        setError('');
    };

    const handleClearSelection = () => {
        setSelectedEmployee(null);
        setSearchTerm('');
        setSuggestions([]);
        setError('');
    };

    const handleDownload = async () => {
        if (!selectedEmployee) {
            setError('Please select an employee');
            return;
        }

        if (!year || year.length !== 4) {
            setError('Please enter a valid year');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const url = `http://localhost:5000/api/v1/reports/epf/${selectedEmployee._id}/${year}`;

            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to download report');
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `EPF_Report_${selectedEmployee.name.replace(/\s+/g, '_')}_${year}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (err) {
            console.error('Download error:', err);
            setError('Failed to download report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-6">
                <Download className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">
                    Download EPF Medical Allowance Report
                </h2>
            </div>

            <div className="space-y-4">
                {/* Employee Search */}
                <div ref={searchRef} className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Employee Name
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                if (!e.target.value) setSelectedEmployee(null);
                            }}
                            onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
                            placeholder="Start typing employee name..."
                            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                        {selectedEmployee ? (
                            <button
                                onClick={handleClearSelection}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        ) : (
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        )}
                    </div>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {suggestions.map((employee) => (
                                <button
                                    key={employee._id}
                                    onClick={() => handleSelectEmployee(employee)}
                                    className="w-full cursor-pointer px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                >
                                    <div className="font-semibold text-gray-800">{employee.name}</div>
                                    <div className="text-sm text-gray-600">
                                        EPF: {employee.epfNumber} | {employee.department?.name || 'N/A'}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {showSuggestions && searchTerm.length >= 2 && suggestions.length === 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
                            No employees found
                        </div>
                    )}
                </div>

                {/* Selected Employee Info */}
                {selectedEmployee && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Selected Employee:</div>
                        <div className="font-semibold text-gray-800">{selectedEmployee.name}</div>
                        <div className="text-sm text-gray-600">
                            EPF Number: {selectedEmployee.epfNumber} | Department: {selectedEmployee.department?.name || 'N/A'}
                        </div>
                    </div>
                )}

                {/* Year Input */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Report Year
                    </label>
                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="2024"
                        min="2000"
                        max="2100"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Download Button */}
                <button
                    onClick={handleDownload}
                    disabled={loading || !selectedEmployee || !year}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all ${loading || !selectedEmployee || !year
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                        }`}
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 cursor-wait border-white border-t-transparent rounded-full animate-spin" />
                            Downloading...
                        </>
                    ) : (
                        <>
                            <Download className="w-5 h-5 cursor-pointer" />
                            Download Report
                        </>
                    )}
                </button>
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
                State Pharmaceuticals Corporation | Welfare Medical Allowance Report
            </div>
        </div>
    );
};

export default EPFReportWidget;