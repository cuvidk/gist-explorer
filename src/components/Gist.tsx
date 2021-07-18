import React, { useEffect, useState } from "react";
import { request } from "@octokit/request";

const Gist = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  // TODO: don't fetch on every render
  useEffect(() => {
    //fetch data
    const fetchGists = async () => {
      const res = await request("GET /gists/public");
      if (res.status !== 200) {
        // display some sort of error ?
        setError(`Failed to fetch data: ${res.status}`);
        setLoading(false);
      }

      console.log(res);
      setLoading(false);
    };

    fetchGists();
  });

  return (
    <div>
      <p>{loading ? "Loading.." : "fetched"}</p>
      <div className="error">{error ?? ""}</div>
    </div>
  );
};

export default Gist;
