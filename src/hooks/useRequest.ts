import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface UseRequestResult<T> {
  data: any | null;
  loading: boolean;
  error: string | null;
  modalRateLimit: boolean;
}

function useRequest<T>(url: any): UseRequestResult<T> {
  const router = useRouter();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalRateLimit, setModalRateLimit] = useState<boolean>(false);
  let errorSend = "Koneksi bermasalah. Silakan tunggu beberapa saat lagi";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await url();

        if (response.status == 200) {
          setData(response.data.result.data);
          setError(null);
          return;
        } else if (response.status == 403) {
          errorSend = "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu";
          setTimeout(() => router.push("/"), 2500);
        } else if (response.status == 429) {
          errorSend = "Terlalu banyak permintaan, silakan coba lagi nanti";
          setModalRateLimit(true)
        }
        throw new Error(errorSend);
      } catch (err: any) {
        setError(errorSend);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error, modalRateLimit };
}

export default useRequest;
