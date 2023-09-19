import { useState, type ChangeEvent, type FC } from "react";
import debounce from "just-debounce-it";
import { searchEndpoint } from "../constants";

type art = {
  url: string;
};

type SearchResult = {
  art: art;
  name: string;
};

type SearchResponse = {
  albums: {
    items: {
      images: art[];
      name: string;
    }[];
  };
};

const Search: FC<{
  authToken: string;
  handleSelectedArt: (art: SearchResult) => void;
}> = ({ authToken, handleSelectedArt }) => {
  const [searchResult, setSearchResult] = useState<SearchResult[] | []>([]);
  const debouncedSearch = debounce(
    (e: ChangeEvent<HTMLInputElement>) => haneleChange(e),
    500
  );

  const haneleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    let searchTerm = e.target.value;
    if (searchTerm) {
      try {
        const response: SearchResponse = await fetch(
          searchEndpoint.replace("{searchterm}", searchTerm),
          {
            method: "get",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${authToken}`,
            },
          }
        ).then((res) => res.json());
        let result = response.albums.items?.map((item) => {
          return { art: item.images[1], name: item.name };
        });
        setSearchResult(result);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <input
        onChange={debouncedSearch}
        type="text"
        className="p-5 m-2 w-42 h-16 bg-pink-200 text-green-600 font-extrabold text-xl rounded-md"
        placeholder="Search album"
      />
      <div
        style={{
          background: "black",
          height: "auto",
        }}
        className=" w-64"
      >
        {searchResult?.length > 0 &&
          searchResult?.map((item) => (
            <div
              key={item.art.url}
              onClick={() => {
                handleSelectedArt(item);
                setSearchResult([]);
              }}
              className="w-64 p-2 bg-black flex items-center justify-between"
            >
              <img
                style={{
                  width: "64px",
                  height: "64px",
                }}
                src={item?.art.url}
              />
              <span>{item?.name}</span>
            </div>
          ))}
      </div>
    </>
  );
};

export default Search;
