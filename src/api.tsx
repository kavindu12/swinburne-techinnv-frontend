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

export async function getResults() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  return fetch(`${HOST}/records`, {
    method: "GET",
    mode: "cors",
    headers: myHeaders,
  }).then((res: Response) => res.json());
}
