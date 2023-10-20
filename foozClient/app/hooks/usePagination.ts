import { useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";

export const usePagination  = <T,> (pageSize: number = 20, initialItems: T[] = []) => {
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const [items, setItems] = useState(initialItems);
  const [pageItems, setPageItems] = useState(initialItems.slice(0, pageSize));
  const [page, setPage] = useState(1);

  const [maxPages, setMaxPages] = useState(1);

  useEffect(function initializeSearchParam() {
    if (!urlSearchParams.get("page")){
      setUrlSearchParams({ ...urlSearchParams, page: "1" });
    }
    else {
      const page = parseInt(urlSearchParams.get("page") ?? "1");
      setPage(page);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(function getPageNumberFromSearchParams() {
    setUrlSearchParams({ ...urlSearchParams, page: page.toString() });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(function updateMaxPages() {
    setMaxPages(Math.ceil(items.length / pageSize));
  }, [items, pageSize])

  useEffect(function updatePageItems() {
    if (items.length <= pageSize){
      setPageItems(items);
    }
    else {
      const startingItem = ((page - 1) * pageSize);
      const endingItem = startingItem + pageSize;
      const newPageItems = items.slice(startingItem, endingItem);
      setPageItems(newPageItems);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, page]);


  return {page, setPage, setItems, pageItems, maxPages};
}