import { useEffect, useRef, useState } from 'react';
import useDebounce from './utils/useDebounce';
import { Country } from './types/country';
import { PAGE_SIZE, SEARCH_DELAY_MILLISECONDS } from './const';
import useKey from './utils/useKey';

const NoContent = ({
  init,
  isLoading,
}: {
  init: boolean;
  isLoading: boolean;
}) => {
  return (
    <div className="text-center">
      {isLoading ? 'Loading...' : init ? 'Not found' : 'Start searching'}
    </div>
  );
};

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [searchKey, setSearchKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [sortOrder, setSortOrder] = useState<'' | 'asc' | 'desc'>('');

  const searchRef = useRef<HTMLInputElement>(null);

  const debounceValue = useDebounce(searchKey, SEARCH_DELAY_MILLISECONDS);
  useKey('KeyK', searchRef);

  useEffect(() => {
    if (debounceValue === '') {
      setCountries([]);
      return;
    }
    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/name/${debounceValue}`
        );
        const data = await res.json();
        if (data.status === 404) {
          setCountries([]);
          return;
        }
        setCountries(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCountries();
  }, [debounceValue]);

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border rounded-lg divide-y divide-gray-200">
            <div className="py-3 px-4 flex justify-between items-center">
              <div className="relative max-w-xs">
                <label className="sr-only">Search</label>
                <input
                  type="text"
                  name="hs-table-with-pagination-search"
                  id="hs-table-with-pagination-search"
                  className="py-2 px-3 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="Search for countries"
                  onChange={(e) => setSearchKey(e.target.value)}
                  value={searchKey}
                  ref={searchRef}
                />
                <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                  <svg
                    className="size-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>
                </div>
              </div>
              {isLoading && (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              )}
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      No.
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      <div className="flex items-center">
                        Country Name
                        <button
                          onClick={() => {
                            const countriesLcl: Country[] = JSON.parse(
                              JSON.stringify(countries)
                            );
                            countriesLcl.sort((a, b) =>
                              sortOrder === 'asc' || sortOrder === ''
                                ? a.name.common < b.name.common
                                  ? 1
                                  : -1
                                : a.name.common > b.name.common
                                ? 1
                                : -1
                            );
                            setCountries(countriesLcl);
                            setSortOrder(
                              sortOrder === 'asc' || sortOrder === ''
                                ? 'desc'
                                : 'asc'
                            );
                          }}
                        >
                          <svg
                            className="w-3 h-3 ms-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Country Flag
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {countries.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="h-48">
                        <NoContent
                          isLoading={isLoading}
                          init={debounceValue !== ''}
                        />
                      </td>
                    </tr>
                  ) : (
                    countries
                      .slice(offset, offset + PAGE_SIZE)
                      .map((country, index) => (
                        <tr key={country.name.common}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                            {offset + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {country.name.common}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-2xl text-gray-800">
                            {country.flag}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
            {countries.length > 0 && (
              <div className="py-1 px-4">
                <nav className="flex justify-end items-center space-x-1">
                  <button
                    type="button"
                    disabled={offset === 0}
                    className="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => setOffset(offset - PAGE_SIZE)}
                  >
                    <span aria-hidden="true">«</span>
                    <span className="sr-only">Previous</span>
                  </button>
                  {[...Array(Math.ceil(countries.length / PAGE_SIZE))].map(
                    (_, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none ${
                          index === offset / PAGE_SIZE ? 'font-bold' : ''
                        }`}
                        aria-current="page"
                        onClick={() => setOffset(index * PAGE_SIZE)}
                      >
                        {index + 1}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    disabled={countries.length <= offset + PAGE_SIZE}
                    className="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => setOffset(offset + PAGE_SIZE)}
                  >
                    <span className="sr-only">Next</span>
                    <span aria-hidden="true">»</span>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
