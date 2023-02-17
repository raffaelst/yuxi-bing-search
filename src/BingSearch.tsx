import React, { useState, useEffect } from "react";
import axios from "axios";

interface Data {
  _type: string;
  webPages: {
    value: {
      name: string;
      url: string;
    }[];
  };
}

const BingSearch: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Data | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const search = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get<Data>(
          `https://api.bing.microsoft.com/v7.0/search/?q=${query}`,
          {
            headers: {
              "Ocp-Apim-Subscription-Key":
                "197f790b9cff4f558fad905ddd421227f13",
            },
          }
        );

        setResults(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      search();
    }
  }, [query]);

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ textAlign: "center" }}>Bing Search</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "50%",
            padding: 8,
            fontSize: 16,
            marginRight: 8,
          }}
        />
        {loading ? (
          <div>Loading...</div>
        ) : (
          <button onClick={() => setQuery(query)}>Search</button>
        )}
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {results && (
        <ul style={{ listStyleType: "none", marginTop: 16 }}>
          {results.webPages.value.map((result) => (
            <li key={result.url} style={{ marginBottom: 8 }}>
              <a href={result.url} style={{ fontSize: 14 }}>
                {result.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BingSearch;
