export type PetalNote = {
  numeral: string
  text: string
}

export const content = {
  recipient: "Ayu",
  sender: "— dari seseorang ",

  intro: {
    kicker: "Sebuah surat kecil, dirawat sampai mekar",
    title: "Selamat Ulang Tahun",
    forWhom: "untuk",
    hint: "enam kelopak menyimpan enam pesan — buka satu per satu, pelan-pelan.",
    cta: "Buka suratnya",
  },

  petals: [
    { numeral: "I", text: "Terima kasih telah lahir, dan memilih untuk tumbuh." },
    { numeral: "II", text: "Kehadiranmu membuat dunia terasa lebih lembut." },
    { numeral: "III", text: "Tawamu adalah rumah bagi banyak orang." },
    { numeral: "IV", text: "Kau jauh lebih kuat dari yang kau kira." },
    { numeral: "V", text: "Semoga tahun ini memeluk semua doamu diam-diam." },
    { numeral: "VI", text: "Aku bersyukur pernah dan masih mengenalmu." },
  ] as PetalNote[],

  flower: {
    hint: "klik kelopak untuk membacanya",
    hintAgain: "klik sekali lagi untuk menggugurkannya",
    locked: "selesaikan dulu kelopaknya, satu per satu",
    remaining: (n: number) => (n === 1 ? "satu kelopak tersisa" : `${n} kelopak tersisa`),
    done: "semua kelopak telah gugur",
  },

  letter: {
    kicker: "dan sekarang, izinkan aku berbisik",
    sentences: [
      "Ada hal-hal yang tidak cukup diucapkan sekali setahun — dan rasa syukur karena kau ada adalah salah satunya.",
      "Tahun demi tahun kau tumbuh tanpa banyak suara, seperti akar yang sabar: tak terlihat, tapi menopang banyak hal.",
      "Terima kasih untuk setiap kali kau memilih bertahan, bahkan saat dunia tidak sedang baik-baik saja.",
      "Semoga lelahmu beristirahat cukup, semoga bahagiamu datang tanpa harus kau kejar.",
      "Semoga tahun ini memberimu alasan untuk tersenyum pada hal-hal kecil, seratus kali sehari.",
      "Dan jika suatu hari kau merasa sendirian, ingatlah: pernah ada surat yang mekar hanya untukmu.",
    ],
    closingTitle: "Panjang umur, bahagia selalu.",
    closingBody:
      "Semoga setiap kelopak yang jatuh hari ini menjadi doa yang tumbuh kembali di musim berikutnya.",
    replay: "Baca sekali lagi",
  },

  birth: {
    kicker: "dan dari kelopak yang gugur, sesuatu dimulai",
    stages: {
      bumi: "Di bawah tanah yang sunyi, tidak ada yang terlihat tumbuh — tapi semuanya sedang disiapkan.",
      umbi: "Sebuah umbi kecil menyimpan seluruh kemungkinan bunga, tanpa perlu membuktikan apa pun.",
      akar: "Akar-akar menjalar tanpa dipuji: memegang, menyerap, menopang.",
      tunas: "Lalu batang pertama berani menembus gelap, hanya karena percaya ada cahaya di atas.",
      kuncup: "Kuncup menahan diri — ada waktunya menutup, sebelum waktunya mekar.",
      mekar: "Dan ia mekar: bukan untuk dilihat, tapi karena memang itulah dirinya.",
      dipetik: "Sekuntum dipetik bukan untuk dimiliki — tapi untuk dikenali, bagian demi bagian.",
      anatomi: "Kamu seperti bunga ini: setiap bagiannya punya nama, dan semuanya berarti.",
    },
    anatomy: {
      hint: "klik bagian bunga untuk mengenalnya",
      hintMobile: "ketuk nomor pada bunga, atau pilih namanya di bawah",
      close: "tutup",
      parts: {
        petal: {
          name: "Mahkota",
          latin: "Petal",
          meaning:
            "Keindahanmu tidak tumbuh untuk dinilai. Ia ada karena kamu bertahan, dan itu sudah cukup.",
        },
        stamen: {
          name: "Benang Sari",
          latin: "Stamen",
          meaning:
            "Setiap doa kecil yang kamu bisikkan ikut terbang — menyerbuk hal-hal baik di tempat yang tak kamu lihat.",
        },
        pistil: {
          name: "Putik",
          latin: "Pistil",
          meaning:
            "Hatimu yang siap menerima. Hal-hal baik butuh tempat singgah, dan kamu menyediakannya.",
        },
        sepal: {
          name: "Kelopak Pelindung",
          latin: "Sepal",
          meaning:
            "Ada orang-orang yang menjagamu tanpa kamu sadari — seperti kelopak yang menutup sebelum kuncup berani terbuka.",
        },
        receptacle: {
          name: "Dasar Bunga",
          latin: "Receptacle",
          meaning:
            "Rumah tempatmu berakar: keluarga, kenangan, dan semua hal yang membuatmu merasa pulang.",
        },
        peduncle: {
          name: "Tangkai",
          latin: "Peduncle",
          meaning:
            "Keteguhan yang tidak menarik perhatian. Tapi tanpa itu, tak ada bunga yang bisa berdiri.",
        },
        ovule: {
          name: "Bakal Biji",
          latin: "Ovule",
          meaning:
            "Masa depanmu sedang menunggu waktu — kecil, tersembunyi, tapi pasti.",
        },
      },
    },
    motion: {
      ask: "aktifkan gerakan perangkat",
      active: "gerakan aktif",
      denied: "gerakan ditolak",
    },
    closing: {
      title: "Dan tahun ini, kamu mekar lagi.",
      body: "Kelopak yang gugur bukan akhir — ia kembali ke tanah, dan dari sana semuanya dimulai sekali lagi. Selamat ulang tahun, untuk kesekian kalinya, dan untuk selamanya.",
      replay: "Baca sekali lagi",
    },
  },

  card: {
    kicker: "kartu kecil untuk dibawa pulang",
    title: "Bawa pulang kartunya",
    subtitle:
      "Tulis ulang dengan kata-katamu sendiri, pilih temanya, lalu bagikan ke story — ukuran 9:16, siap untuk Instagram dan WhatsApp.",
    kickerTop: "Selamat Ulang Tahun",
    toPrefix: "untuk",
    fromPrefix: "— dari",
    toLabel: "Untuk",
    messageLabel: "Ucapan",
    fromLabel: "Dari",
    messagePlaceholder: "Tulis ucapanmu…",
    fromPlaceholder: "Namamu",
    defaultMessage:
      "Selamat ulang tahun. Semoga tahun ini kamu mekar seperti lily — perlahan, tanpa tergesa, dan tepat pada waktunya. Terima kasih sudah tumbuh setahun lagi; dunia terasa lebih lembut karena itu.",
    defaultFrom: "seseorang yang menyayangimu",
    reset: "kembalikan contoh",
    download: "Unduh PNG",
    share: "Bagikan ke Story",
    shareTitle: "Kartu ulang tahun",
    generating: "menyiapkan kartu…",
    shared: "kartu terkirim ke lembar berbagi.",
    downloaded: "PNG terunduh — unggah langsung ke story dari galeri.",
    cancelled: "dibatalkan.",
    error: "maaf, kartu gagal dibuat. coba sekali lagi.",
    hint: "1080 × 1920 px · PNG · 9:16",
    themes: { paper: "terang", ink: "gelap" },
  },
} as const

export type Content = typeof content
