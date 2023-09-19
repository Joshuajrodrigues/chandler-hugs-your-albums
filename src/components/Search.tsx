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
  handleSelectedArt:(art:SearchResult)=>void
}> = ({ authToken,handleSelectedArt }) => {
  const [searchResult, setSearchResult] = useState<SearchResult[] | []>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<SearchResult | {}>({ "art": { "height": 300, "url": "https://i.scdn.co/image/ab67616d00001e02b4ad7ebaf4575f120eb3f193", "width": 300 }, "name": "Meteora" });
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
        style={{
          all: "unset",
          padding: "10px 2px",
          margin: "10px 5px",
          background: "rgb(82, 171, 209)",
          height: "20px",
          color: "black",
        }}
        placeholder="Search album"
      />
      <div
        style={{
          background: "black",
          height: "auto",
        }}
      >
        {searchResult?.length > 0 &&
          searchResult?.map((item) => (
            <div
                key={item.art.url}
              onClick={() => {handleSelectedArt(item);setSearchResult([])}}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "10px",
                cursor: "pointer",
              }}
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
