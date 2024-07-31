import { useState, useEffect } from "react";
import moment from "moment";
import "moment/locale/id";

const SEOFooter = () => {
  const [read, setRead] = useState(false);

  return (
    <div className="text-sm py-5 pb-[7rem] bg-[#F9F9F9] mb-[-6rem]">
      <div className="flex flex-col space-y-2 text-left px-4 mt-4">
        {read ? (
          <div>
            <p className="mb-3 font-bold">
              Daftar Harga Kartu Perdana Terbaru{" "}
              {moment().locale("id").format("MMMM yyyy")}
            </p>

            <div className="flex flex-col">
              <div className="overflow-x-auto border border-[gray-500] radius-[10px] rounded-lg">
                <div className="p-1.5 min-w-full inline-block align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <tbody className="divide-y divide-gray-200">
                        {[
                          {
                            text: "Harga Kartu Perdana AXIS Suka-Suka Sosmed 2 Bulan 5GB + 168GB",
                            value: "25,000",
                          },
                          {
                            text: "Harga Kartu Perdana AXIS Suka-Suka Sosmed 2 Bulan 9GB + 168GB",
                            value: "30,000",
                          },
                          {
                            text: "Harga Kartu Perdana AXIS Suka-Suka Sosmed 2 Bulan 12GB + 168GB",
                            value: "35,000",
                          },
                          {
                            text: "Harga Kartu Perdana AXIS Suka-Suka Sosmed 2 Bulan 44GB + 168GB",
                            value: "94,500",
                          },
                          {
                            text: "Harga Kartu Perdana AXIS Suka-Suka Youtube 2 Bulan 5GB + 168GB",
                            value: "25,000",
                          },
                          {
                            text: "Harga Kartu Perdana AXIS Suka-Suka Youtube 2 Bulan 9GB + 168GB",
                            value: "30,000",
                          },
                          {
                            text: "Harga Kartu Perdana AXIS Suka-Suka Youtube 2 Bulan 12GB + 168GB",
                            value: "35,000",
                          },
                          {
                            text: "Harga Kartu Perdana AXIS Suka-Suka Youtube 2 Bulan 44GB + 168GB",
                            value: "94,500",
                          },
                        ].map((item, i) => (
                          <tr key={i}>
                            <td className="text-sm px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800">
                              {item.text}
                            </td>
                            <td className="px-3 py-2 text-sm whitespace-nowrap text-sm text-gray-800 text-end">
                              Rp{item.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <p className="my-3">
              Untuk detail produk perdana kamu bisa cek di halaman berikut ini{" "}
              <span className="underline text-[#EB008B]">
                <a href="/pilih">https://store.axis.co.id/pilih</a>
              </span>
            </p>
            <p>
              Beli aneka produk kartu perdana SIM atau eSIM secara online secara
              mudah, cepat, aman & flat ongkir se-Indonesia hanya Rp 9.000 lewat
              AXIS Store. Kamu bisa cek daftar harga terbaru kartu perdana AXIS
              di {moment().locale("id").format("MMMM yyyy")} yang bisa diurutkan
              dari harga yang termurah hingga bonus kuota internet yang
              didapatkan! Pastinya katalog produk kartu perdana SIM atau eSIM
              terlengkap di AXIS Store. Yuk cari dan pilih kuota internet,
              sebelum kamu memilih tipe SIM yang pas untuk kamu!
            </p>
            <p className="my-3 font-bold">
              Nikmati Pengalaman Menyenangkan & Lebih Hemat Belanja di AXIS
              Store
            </p>
            <p>
              Untuk melakukan pembelian kartu perdana di AXIS Store, kamu dapat
              lakukan dengan mengikuti langkah berikut ini:
            </p>
            <ol className="list-decimal ml-4 my-3">
              <li>
                Pilih produk kartu SIM atau eSIM dengan kuota paket internet
                yang sesuai kebutuhan kamu
              </li>
              <li>
                Lakukan pengisian alamat pengiriman paket dan data diri kamu
                yang benar
              </li>
              <li>
                Lakukan pembayaran dengan pilih metode atau cara pembayaran
                kamu. Nikmati promo pengiriman flat ongkir se-Indonesia hanya Rp
                9.000.
              </li>
              <li>
                Kamu tinggal tunggu pesanan kamu sampai tujuan. Untuk pengecekan
                status pesanan kamu dapat cek di{" "}
                <span className="underline text-[#EB008B]">
                  <a href="/cek-status" target="_blank">
                    https://store.axis.co.id/cek-status
                  </a>
                </span>
              </li>
            </ol>
            <p>
              Tunggu apalagi? Yuk beli kartu perdana SIM atau eSIM AXIS online
              dengan mudah & cepat kapanpun dimanapun lewat AXIS Store. Selain
              itu kamu bisa ganti nomor AXIS kamu dan dapatkan nomor cantik yang
              kamu inginkan dengan mudah di AXIS Store{" "}
              <span className="underline text-[#EB008B]">
                <a href="https://pilih.axis.co.id/pilih" target="_blank">
                  https://pilih.axis.co.id/pilih
                </a>
              </span>
              .
            </p>
          </div>
        ) : (
          <p className="font-bold">
            Daftar Harga Kartu Perdana Terbaru Mei 2024...
          </p>
        )}
        <div
          className="text-[#EB008B] uppercase text-xs tracking-wide font-bold mt-4 cursor-pointer"
          onClick={() => setRead(!read)}
        >
          {read ? "tutup" : "Baca lebih lanjut"}
        </div>
      </div>
    </div>
  );
};

export default SEOFooter;
