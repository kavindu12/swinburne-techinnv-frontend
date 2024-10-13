import { atom, useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";

const HOST = process.env.NODE_ENV === "development" ? "http://174.129.115.81:5001/" : "";

export const predictedClassLabels: Record<string, string> = {
  "0": "Benign",
  "1": "Botnet",
  "2": "Brute-force",
  "3": "DDoS attack",
  "4": "DoS attack",
  "5": "Infilteration",
  "6": "Web attack",
};

export const predictedClassesList = Object.keys(predictedClassLabels);

type Result = {
  predicted_class: "0" | "1" | "2" | "3" | "4" | "5" | "6";
  timestamp: string;
  id: string;
  filename: string;
};

export async function getPrediction(input: any, filename?: string) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  return fetch(`${HOST}/predict`, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify({
      input: [input],
      filename,
    }),
    headers: myHeaders,
  }).then((res: Response) => res.json());
}

export const getResults = async (): Promise<Result[]> => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  return fetch(`${HOST}/records`, {
    method: "GET",
    mode: "cors",
    headers: myHeaders,
  }).then((res: Response) => res.json());
};

export const recordsAtom = atom<Result[]>([]);

export const useRecords = () => {
  const [records] = useAtom(recordsAtom);
  return [records];
};

export function DataRefresher() {
  const setRecords = useSetAtom(recordsAtom);

  useEffect(() => {
    setInterval(async () => {
      const data = await getResults();
      setRecords(data);
    }, 5000);
  }, []);

  return null;
}
