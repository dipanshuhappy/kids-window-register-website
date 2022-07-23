import React from "react";

function DropDown({ list, title,onItemCLick}) {
  const [showDropDown, setShowDropDown] = React.useState(false);
  const toggleDropDown = () => setShowDropDown(!showDropDown);
  
  return (
    <>
      <button
        id="dropdownRadioBgHoverButton"
        data-dropdown-toggle="dropdownRadioBgHover"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={toggleDropDown}
      >
        {title}
        <svg
          class="ml-2 w-4 h-4"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      {showDropDown && (
        <div
          id="dropdownRadioBgHover"
          class="z-10 ml-auto mr-auto w-48 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
        >
          <ul
            class="p-3 space-y-1 ml-auto mr-auto text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownRadioBgHoverButton"
          >
            {list.map((value,index) => (
              <li key={index} onClick={()=>{ onItemCLick(value)}}>
                <div class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                  <div
                    type="radio"
                    value=""
                    name="default-radio"
                    class="w-4 h-4 text-blue-600  focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  >
                  <p
                    class="ml-2 w-full text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                  >
                    {value}
                 </p>
                 </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default DropDown;
