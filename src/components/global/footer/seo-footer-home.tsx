import { useState, useEffect } from "react";
import moment from "moment";
import "moment/locale/id";

const SEOFooterHome = () => {
  const [read, setRead] = useState(false);

  return (
    <div className="text-sm py-5  bg-[#F9F9F9] relative w-full md:w-[86%] rounded-t-lg">
      <div className="flex flex-col space-y-2 text-left px-4 mt-4">
        {read ? (
          <div>
            <p className="font-bold">
              Beli Kartu Perdana AXIS Online di AXIS Store
            </p>
            <p className="py-3">
              Pesan kartu perdana kini lebih mudah dan cepat lewat AXIS Store.
              Pilih kartu dan paket kartu perdana sesuai kebutuhanmu. Nikmati
              flat ongkir Rp 9.000 se-Indonesia untuk setiap pembelian kartu
              perdana SIM atau eSIM di AXIS Store.
            </p>

            <p className="font-bold">Pengertian Kartu Perdana</p>
            <p className="my-3">
              Kartu perdana merupakan kartu SIM (Subscriber Identity Module)
              yang pertama kali digunakan atau dalam keadaan benar-benar baru
              yang belum pernah dipasang ke slot SIM HP. Kartu perdana digunakan
              pada perangkat telekomunikasi untuk mengakses jaringan
              telekomunikasi. Pada suatu kartu perdana berisi informasi pribadi
              pengguna, seperti nomor telepon dan data identitas unik yang
              memungkinkan pengguna untuk terhubung dengan jaringan.
            </p>
            <p className="font-bold">Perbedaan Kartu Perdana SIM dan eSIM</p>
            <p className="my-3">
              Kartu perdana SIM umumnya mudah ditemukan di gerai penyedia pulsa
              di sekitar kita. Saat ini bentuk dari kartu perdana pun berubah
              seiring waktu, sehingga muncul kartu SIM berukuran micro yang
              dipecah dari bentuk kartu perdana standar. Saat ini peningkatan
              pada bidang teknologi berhasil menciptakan kartu SIM yang tidak
              memiliki fisik dan berbeda dengan kartu SIM biasa terdahulu yang
              harus diinput ke dalam slot kartu perangkat.
            </p>
            <p className="mb-3">
              Kartu perdana eSIM tidak memiliki bentuk fisik, sehingga kartu
              perdana eSIM ini pun terhindar dari bahaya kerusakan ataupun
              kehilangan. Jika pada kartu SIM dapat menyimpan nomor kontak di
              dalam penyimpanan kartu, pada kartu eSIM akan menyimpan nomor
              kontak ke dalam sistem cloud yang disediakan oleh provide eSIM.
              Dengan ini, pengguna eSIM tidak perlu merasa khawatir nomor kontak
              hilang karena fisik dari kartu SIM yang rusak.
            </p>
            <p>
              Saat ini AXIS mempermudah kamu yang sedang mencari dan ingin
              membeli kartu perdana tanpa ribet, lewat AXIS Store! Kamu dapat
              beli kartu perdana SIM ataupun eSIM, pilih dan ganti nomor kartu
              cantik AXIS kamu lewat AXIS Store. Hingga lacak pesanan kartu
              perdana kamu dengan mudah. Tunggu apa lagi buruan beli kartu
              perdana kamu di AXIS Store!
            </p>
          </div>
        ) : (
          <p className="font-bold">
            Beli Kartu Perdana AXIS Online di AXIS Store...
          </p>
        )}
        <div
          className="text-[#EB008B] uppercase text-xs tracking-wide font-bold !mt-3 cursor-pointer"
          onClick={() => setRead(!read)}
        >
          {read ? "tutup" : "Baca lebih lanjut"}
        </div>
      </div>
    </div>
  );
};

export default SEOFooterHome;
