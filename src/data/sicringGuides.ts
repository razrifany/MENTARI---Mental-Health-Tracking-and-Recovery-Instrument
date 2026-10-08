import { SicringComponentKey } from '../types';

export interface SicringVideoGuide {
  title: string;
  duration: string;
  durationSeconds: number;
  instructor: string;
  role: string;
  thumbnailGradient: string;
  description: string;
  chapters: {
    time: string;
    seconds: number;
    title: string;
    detail: string;
  }[];
  keyVisualTips: string[];
}

export interface SicringAudioGuide {
  title: string;
  narrator: string;
  duration: string;
  durationSeconds: number;
  bgSound: string;
  frequency: string;
  overview: string;
  scriptLines: {
    time: string;
    text: string;
  }[];
}

export interface SicringTextGuide {
  summary: string;
  benefits: string[];
  preparation: string[];
  affirmationDoa: {
    title: string;
    arabicOrFormula?: string;
    meaning: string;
    howToRecite: string;
  };
  stepsDetailed: {
    stepNumber: number;
    title: string;
    duration: string;
    instruction: string;
    clinicalTip: string;
  }[];
  partnerGuide?: string;
  safetyCautions: string[];
}

export interface SicringDetailedGuide {
  moduleId: SicringComponentKey;
  number: number;
  badge: string;
  title: string;
  subtitle: string;
  video: SicringVideoGuide;
  audio: SicringAudioGuide;
  text: SicringTextGuide;
}

export const DEFAULT_SICRING_TEXT_GUIDES: Record<SicringComponentKey, string> = {
  olah_tubuh: `PANDUAN OLAH TUBUH SADAR (MINDFUL BODY)

1. Tujuan & Manfaat:
Latihan ini memadukan kesadaran tubuh, pernapasan diafragma 4-4-6, dan peregangan lembut untuk menstabilkan detak jantung, meredakan ketegangan otot pundak, serta mengalirkan oksigen segar ke buah hati.

2. Persiapan:
• Duduk tegak bersandar nyaman di kursi atau berbaring miring ke kiri dengan bantal penyangga di antara lutut.
• Kenakan pakaian longgar yang tidak menekan area perut.
• Letakkan satu telapak tangan di dada dan satu telapak tangan di atas perut.

3. Langkah-Langkah Latihan:
• Pernapasan Diafragma 4-4-6:
  Tarik napas perlahan melalui hidung selama 4 detik (rasakan perut mengembang lembut). Tahan napas 4 detik. Hembuskan perlahan lewat bibir selama 6 detik. Ulangi 5-8 kali.
• Peregangan Bahu & Leher:
  Putar bahu ke belakang 5 kali dan ke depan 5 kali secara perlahan. Miringkan kepala ke kanan dan ke kiri secara lembut untuk melepaskan beban pundak.
• Relaksasi Panggul & Kaki:
  Putar pergelangan kaki melingkar searah dan berlawanan jarum jam. Lemaskan otot paha dan panggul.

4. Doa & Afirmasi Ketenangan:
"Ya Tuhanku, lapangkanlah dadaku, tenangkanlah jiwaku, dan mudahkanlah segala urusanku."

5. Catatan Keamanan:
Hentikan latihan segera jika merasa pusing, mual, sesak napas, atau timbul rasa kencang berlebih pada perut.`,

  charging: `PANDUAN CHARGING RUHANI & AFIRMASI

1. Tujuan & Manfaat:
Sesi hening psikospiritual untuk memulihkan energi batin, melepaskan rasa cemas atau rasa bersalah (mom guilt), serta memperkuat ikatan kasih sayang antara ibu dan buah hati.

2. Persiapan:
• Pilih tempat yang tenang dan minim gangguan suara selama 10 menit.
• Duduk dengan posisi santai dan sandaran punggung yang nyaman.
• Pejamkan mata perlahan dan atur napas secara alami.

3. Langkah-Langkah Latihan:
• Hening & Sadar Momen Ini:
  Tutup mata perlahan. Sadari setiap hela napas sebagai anugerah. Lepaskan sejenak pikiran tentang urusan rumah tangga atau pekerjaan.
• Afirmasi Penerimaan Diri:
  Ucapkan dalam hati: "Tubuhku kuat, jiwaku tenang. Setiap rasa lelah adalah bukti cintaku, dan aku berhak beristirahat serta bahagia."
• Ikatan Kasih Buah Hati:
  Usap perut atau peluk bantal dengan lembut. Alirkan doa, energi kedamaian, dan kehangatan tulus untuk buah hati tercinta.
• Doa Pasrah & Tawakal:
  Serahkan segala kekhawatiran masa depan kepada Sang Maha Pemelihara. Rasakan beban di dada terangkat perlahan.

4. Catatan Keamanan:
Bila muncul ingatan atau emosi yang sangat berat, buka mata perlahan, minum air hangat, dan hubungi Bidan Pembina untuk pendampingan.`,

  healing_touch: `PANDUAN HEALING TOUCH PENDAMPING (UNTUK SUAMI / KELUARGA)

1. Tujuan & Manfaat:
Panduan sentuhan kasih dan pijatan lembut di area bahu serta punggung yang dilakukan oleh suami atau keluarga. Berfungsi merangsang pelepasan hormon oksitosin (hormon cinta), meredakan pegal, serta memperlancar produksi ASI.

2. Persiapan:
• Ibu duduk santai di kursi dengan memeluk bantal di pangkuan.
• Siapkan minyak alami hangat (minyak kelapa VCO, zaitun murni, atau baby oil).
• Suami/pendamping mencuci tangan dan menggosok telapak tangan hingga hangat.

3. Langkah-Langkah untuk Pendamping / Suami:
• Usapan Lembut Pundak & Bahu:
  Letakkan kedua telapak tangan di pundak ibu. Usap perlahan dari pangkal leher ke ujung bahu luar dengan tekanan yang lembut dan ritmis.
• Pijatan Garis Oksitosin di Punggung:
  Gunakan kedua jempol berjarak 2 jari dari tulang belakang (kanan dan kiri). Buat gerakan memutar melingkar kecil dari tengkuk turun perlahan ke batas tali bra. Lakukan selama 5-8 menit.
• Dekapan Hangat & Penguatan Kata:
  Rangkul ibu dari belakang dengan tulus dan bisikkan kalimat penguatan: "Terima kasih sudah berjuang hebat, kamu ibu yang luar biasa dan aku selalu mendampingimu."

4. Catatan Keamanan:
• DILARANG KERAS memijat area perut ibu!
• Jangan menekan tulang belakang langsung; pijatan hanya dilakukan pada otot di kanan dan kiri tulang belakang.`,

  blessing_water: `PANDUAN BLESSING WATER (HIDRASI BERKESADARAN)

1. Tujuan & Manfaat:
Praktik minum air putih secara berkesadaran (mindful drinking) yang dipadukan dengan doa kesembuhan dan rasa syukur untuk menstabilkan sistem saraf otonom dan mencukupi hidrasi perinatal harian.

2. Persiapan:
• Sediakan segelas air putih matang yang higienis bersuhu sejuk atau hangat kuku (200-250 ml).
• Duduk tegak di tempat yang nyaman dan tenang.

3. Langkah-Langkah Latihan:
• Menatap Gelas dengan Penuh Syukur:
  Pegang gelas dengan kedua belah tangan di dekat dada. Rasakan suhu dan bobot gelas air sebagai anugerah sumber kehidupan.
• Membaca Doa & Niat Kesembuhan:
  Tatap permukaan air jernih dan bacakan doa: "Ya Allah, jadikanlah air ini sebagai penawar, kesegaran sel-sel tubuhku, dan penyejuk jiwaku."
• Tegukan Perlahan Berkesadaran:
  Teguk air sedikit demi sedikit (3-5 tegukan). Hayati sensasi kesejukan air saat membasahi tenggorokan dan mengalir menenangkan rongga dada.
• Hening Bersyukur:
  Letakkan gelas kembali, hembuskan napas panjang lega, dan ucapkan rasa syukur atas nikmat kesehatan hari ini.

4. Catatan Keamanan:
Gunakan air matang yang bersih. Minum dalam posisi duduk dan hindari terburu-buru agar tidak tersedak.`,

  pendampingan: `PANDUAN PENDAMPINGAN PERSONAL BIDAN

1. Tujuan & Manfaat:
Sesi konseling terstruktur 1-on-1 bersama Bidan TPMB untuk mendiskusikan keluhan fisik, kecemasan emosional, adaptasi peran ibu baru, serta merencanakan asuhan kesehatan perinatal secara personal.

2. Persiapan:
• Catat unek-unek, keluhan fisik, atau beban pikiran yang paling mengganjal dalam 7 hari terakhir.
• Bawa Buku KIA dan catatan riwayat pemeriksaan kehamilan/nifas.

3. Topik yang Dapat Didiskusikan:
• Rasa lelah berlebihan, sering menangis, atau perasaan bersalah.
• Kecemasan menjelang persalinan atau kebingungan menyusui/merawat bayi baru lahir.
• Dukungan keluarga dan komunikasi dengan suami.
• Rencana rujukan kolaboratif ke dokter spesialis atau psikolog jika diperlukan.

4. Jaminan Kerahasiaan Medis:
Seluruh isi percakapan dan catatan konsultasi bersifat 100% rahasia medis dan berada dalam pengawasan Bidan Profesional TPMB.

5. Jadwal Konsultasi:
Silakan gunakan tombol "Jadwalkan Konsultasi Bidan" untuk memilih waktu temu tatap muka di klinik atau konsultasi daring.`
};

export const SICRING_DETAILED_GUIDES: Record<SicringComponentKey, SicringDetailedGuide> = {
  olah_tubuh: {
    moduleId: 'olah_tubuh',
    number: 1,
    badge: 'Fisik & Pernapasan',
    title: 'Olah Tubuh Sadar (Mindful Body)',
    subtitle: 'Gerakan lembut & pernapasan diafragma 4-4-6 perinatal',
    video: {
      title: 'Tutorial Demonstrasi Gerakan Lembut & Pernapasan Diafragma 4-4-6',
      duration: '08:20',
      durationSeconds: 500,
      instructor: 'Bdn. Hj. Siti Rahma, S.Tr.Keb',
      role: 'Bidan Praktisi Perinatal & Instruktur Senam Hamil',
      thumbnailGradient: 'from-sky-700 via-sky-600 to-cyan-500',
      description: 'Panduan visual langkah demi langkah menemukan posisi duduk dan miring yang ergonomis, melatih otot diafragma agar perut mengembang rileks, serta melemaskan ketegangan pundak dan leher.',
      chapters: [
        { time: '00:00', seconds: 0, title: 'Pengenalan & Posisi Ergonomis Ibu', detail: 'Cara menyangga punggung dan panggul dengan bantal penyangga.' },
        { time: '01:15', seconds: 75, title: 'Pernapasan Diafragma 4-4-6', detail: 'Tarik napas 4 detik lewat hidung, tahan 4 detik, buang lewat bibir 6 detik.' },
        { time: '03:40', seconds: 220, title: 'Peregangan Bahu, Leher & Tulang Belakang', detail: 'Rotasi bahu lembut untuk mengurai kekakuan akibat menyusui atau beban perut.' },
        { time: '06:10', seconds: 370, title: 'Relaksasi Kaki, Pergelangan & Panggul', detail: 'Gerakan memutar telapak kaki untuk memperlancar sirkulasi darah vena.' },
      ],
      keyVisualTips: [
        'Pastikan dagu rileks dan bahu turun, jangan mengangkat bahu saat menarik napas.',
        'Bila usia kehamilan >28 minggu, gunakan posisi miring kiri atau duduk bersandar 45 derajat.',
        'Gunakan pakaian longgar yang tidak menekan lingkar perut.',
      ],
    },
    audio: {
      title: 'Audio Bimbingan Relaksasi Otot Progresif & Napas Diafragma',
      narrator: 'Bidan Pembina TPMB Mentari',
      duration: '08:00',
      durationSeconds: 480,
      bgSound: 'Deru ombak lembut & Frekuensi Solfeggio 432 Hz',
      frequency: '432 Hz (Penenang Sistem Saraf Otonom)',
      overview: 'Narasi suara lembut yang menuntun Ibu menyadari setiap helaan napas, melepaskan kepalan tangan, dan meredakan detak jantung yang berdebar kencang.',
      scriptLines: [
        { time: '00:05', text: 'Bismillah... Pejamkan mata Ibu dengan lembut. Sadari tubuh Ibu yang telah berjuang luar biasa hari ini.' },
        { time: '01:20', text: 'Tarik napas perlahan... Satu, dua, tiga, empat. Rasakan perut Ibu mengembang lembut seperti balon hangat.' },
        { time: '02:00', text: 'Tahan sejenak... dan hembuskan perlahan melalui bibir... Enam detik pelepasan beban batin.' },
        { time: '04:15', text: 'Lepaskan ketegangan di pundak Ibu. Biarkan bumi menopang tubuh Ibu seutuhnya. Ibu aman, Ibu terlindungi.' },
        { time: '06:30', text: 'Alirkan oksigen segar ini ke seluruh pembuluh darah hingga sampai dengan damai ke buah hati tercinta.' },
      ],
    },
    text: {
      summary: 'Komponen pertama SICRING melatih kesadaran somatik tubuh. Ibu belajar melepaskan hormon adrenalin dan kortisol melalui napas ritmis lambat, merangsang saraf parasimpatis agar denyut nadi stabil dan rahim rileks.',
      benefits: [
        'Meredakan sesak napas dan ketegangan otot dada.',
        'Mengurangi risiko insomnia dan kelelahan kronis ibu.',
        'Meningkatkan saturasi oksigen ke plasenta dan janin.',
        'Mempersiapkan elastisitas panggul menjelang atau pasca persalinan.',
      ],
      preparation: [
        'Ruangan dengan sirkulasi udara baik dan suhu nyaman (24-26°C).',
        'Satu atau dua buah bantal empuk untuk penopang punggung/lutut.',
        'Matras yoga atau tempat tidur yang tidak terlalu amblas.',
      ],
      affirmationDoa: {
        title: 'Doa Ketenangan Jiwa & Afirmasi Napas',
        arabicOrFormula: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
        meaning: '"Ya Tuhanku, lapangkanlah dadaku, dan mudahkanlah urusanku." (QS. Thaha: 25-26)',
        howToRecite: 'Ucapkan dalam hati setiap kali menghembuskan napas panjang 6 detik.',
      },
      stepsDetailed: [
        {
          stepNumber: 1,
          title: 'Pengaturan Posisi & Kenyamanan',
          duration: '1 Menit',
          instruction: 'Duduk bersandar tegak di kursi atau berbaring miring ke kiri. Letakkan telapak tangan kanan di perut atas dan telapak tangan kiri di dada untuk merasakan detak napas.',
          clinicalTip: 'Posisi miring kiri mencegah penekanan pembuluh darah vena kava inferior oleh pembesaran rahim.',
        },
        {
          stepNumber: 2,
          title: 'Pernapasan Diafragma Irama 4-4-6',
          duration: '3 Menit',
          instruction: 'Hirup udara lewat hidung selama 4 hitungan. Rasakan tangan di perut yang terangkat, sementara dada tetap rileks. Tahan 4 hitungan. Hembuskan melalui mulut selama 6 hitungan dengan bibir mengerucut lembut.',
          clinicalTip: 'Hembusan 6 detik yang lebih panjang dari tarikan napas mengaktifkan respons relaksasi nervus vagus.',
        },
        {
          stepNumber: 3,
          title: 'Pelepasan Ketegangan Pundak & Leher',
          duration: '2 Menit',
          instruction: 'Putar bahu ke belakang sebanyak 5 kali secara perlahan, lalu ke depan 5 kali. Miringkan telinga kanan mendekati pundak kanan tahan 5 detik, bergantian dengan sisi kiri.',
          clinicalTip: 'Ibu perinatal sering mengalami penegangan trapezius akibat posisi menggendong atau perubahan postur lordosis.',
        },
        {
          stepNumber: 4,
          title: 'Relaksasi Panggul & Kaki Berkesadaran',
          duration: '2 Menit',
          instruction: 'Putar pergelangan kaki searah jarum jam 5 kali, lalu berlawanan arah. Goyangkan jemari kaki lembut. Rasakan sensasi hangat menjalar dari panggul ke ujung kaki.',
          clinicalTip: 'Membantu mencegah pembengkakan (edema) tungkai bawah dan kram betis di malam hari.',
        },
      ],
      safetyCautions: [
        'Hentikan latihan segera jika muncul rasa pusing melayang, kunang-kunang, kontraksi perut berulang, atau perdarahan.',
        'Jangan menahan napas terlalu lama jika merasakan sesak atau kekurangan udara.',
      ],
    },
  },

  charging: {
    moduleId: 'charging',
    number: 2,
    badge: 'Psikospiritual & Doa',
    title: 'Charging Ruhani & Afirmasi',
    subtitle: 'Penyegaran batin, rasa syukur & afirmasi kasih sayang ibu',
    video: {
      title: 'Visualisasi Hening Batin & Afirmasi Ikatan Kasih Ibu-Bayi',
      duration: '10:15',
      durationSeconds: 615,
      instructor: 'Dra. Hj. Nur Aini, M.Psi & Bdn. Siti Rahma',
      role: 'Konselor Kesehatan Mental Perinatal',
      thumbnailGradient: 'from-purple-800 via-indigo-700 to-sky-600',
      description: 'Panduan audiovisual hening batin untuk memulihkan energi emosional ibu, menepis perasaan bersalah atau cemas tidak mampu menjadi ibu baik, serta mengokohkan spiritualitas berserah diri.',
      chapters: [
        { time: '00:00', seconds: 0, title: 'Menemukan Keheningan Diri', detail: 'Mengalihkan fokus dari kebisingan luar ke dalam ruang batin yang teduh.' },
        { time: '02:30', seconds: 150, title: 'Afirmasi Penerimaan Diri', detail: 'Memaafkan rasa lelah dan mengakui perjuangan fisik yang luar biasa.' },
        { time: '05:45', seconds: 345, title: 'Mengalirkan Kasih Sayang Janin/Bayi', detail: 'Sentuhan tangan di perut atau pelukan batin yang menenangkan detak jantung bayi.' },
        { time: '08:20', seconds: 500, title: 'Doa Tawakal & Pelepasan Beban', detail: 'Menyerahkan kekhawatiran masa depan kepada Sang Maha Pengasih.' },
      ],
      keyVisualTips: [
        'Redupkan lampu ruangan atau gunakan pencahayaan hangat alami.',
        'Tutup mata secara perlahan dan biarkan ekspresi wajah mengendur.',
      ],
    },
    audio: {
      title: 'Audio Meditasi Doa & Afirmasi Kasih Sayang',
      narrator: 'Konselor Psikospiritual MENTARI',
      duration: '10:00',
      durationSeconds: 600,
      bgSound: 'Alunan Lirih Piano Akustik & Nada Alam Hening',
      frequency: '528 Hz (Frekuensi Kedamaian Hati & Restorasi Batin)',
      overview: 'Membantu ibu yang merasa kewalahan atau cemas (baby blues / cemas hamil) untuk rehat sejenak dan mengisi ulang baterai emosional dengan rasa syukur mendalam.',
      scriptLines: [
        { time: '00:10', text: 'Ibu yang terkasih... tarik napas lembut. Kamu sudah melakukan yang terbaik hari ini.' },
        { time: '02:00', text: 'Katakan pada dirimu: "Aku tidak harus menjadi ibu yang sempurna, aku cukup hadir dengan cinta dan kasih sayang."' },
        { time: '04:30', text: 'Usap perutmu... Katakan pada buah hatimu: "Nak, ibu menyayangimu. Kita berdua kuat dan kita sedang bertumbuh bersama."' },
        { time: '07:15', text: 'Lepaskan beban yang tak bisa kau kendalikan. Serahkan kepada Sang Maha Pelindung. Jiwamu kini damai dan lapang.' },
      ],
    },
    text: {
      summary: 'Charging Ruhani merupakan inti psikospiritual intervensi SICRING. Menggabungkan konsep mindfulness berbasis nilai religius lokal untuk menghadirkan rasa aman emosional, syukur, dan koneksi batin antara ibu dan janin/bayi.',
      benefits: [
        'Meredakan rasa bersalah (mom guilt) dan kecemasan masa depan.',
        'Memperkuat bonding ikatan batin ibu dengan janin/bayi.',
        'Meningkatkan hormon oksitosin dan endorfin penenang alami.',
        'Menciptakan ruang batin yang jernih untuk mengambil keputusan bijak.',
      ],
      preparation: [
        'Pilih waktu hening (misal: sebelum tidur malam atau setelah fajar/pagi hari).',
        'Matikan notifikasi gawai sejenak selama 10 menit.',
      ],
      affirmationDoa: {
        title: 'Naskah Afirmasi Batin Ibu MENTARI',
        meaning: '"Tubuhku adalah rumah yang aman dan penuh berkah. Setiap detak jantungku menyalurkan kedamaian untuk buah hatiku. Aku berhak bahagia, aku berhak beristirahat."',
        howToRecite: 'Resapi dan ulangi 3 kali dalam hati dengan meletakkan tangan di dada.',
      },
      stepsDetailed: [
        {
          stepNumber: 1,
          title: 'Hening & Sadar Momen Kini',
          duration: '1.5 Menit',
          instruction: 'Tutup mata. Jangan memikirkan cucian, pekerjaan rumah, atau masa depan sejenak. Berikan 10 menit ini sepenuhnya untuk diri Ibu sendiri.',
          clinicalTip: 'Menghentikan sirkuit rumination otak (Default Mode Network) yang memicu kecemasan.',
        },
        {
          stepNumber: 2,
          title: 'Afirmasi Penerimaan Diri',
          duration: '3.5 Menit',
          instruction: 'Tarik napas dan katakan: "Aku menerima rasa lelahku, aku memaafkan kekuranganku. Aku sedang berproses menjadi ibu yang penuh cinta."',
          clinicalTip: 'Mengurangi self-criticism yang berkorelasi tinggi dengan skor depresi EPDS tinggi.',
        },
        {
          stepNumber: 3,
          title: 'Ikatan Kasih Sayang Janin / Bayi',
          duration: '3 Menit',
          instruction: 'Letakkan kedua tangan di perut atau peluk bantal secara lembut. Bayangkan senyuman buah hati dan bisikkan kata-kata doa terbaik untuknya.',
          clinicalTip: 'Sentuhan abdominal sadar menstimulasi pelepasan hormon cinta oksitosin pada ibu dan janin.',
        },
        {
          stepNumber: 4,
          title: 'Doa Tawakal & Kelegaan Jiwa',
          duration: '2 Menit',
          instruction: 'Hembuskan napas panjang dan pasrahkan segala ketakutan kepada Sang Khalik. Rasakan pundak dan dada menjadi sangat ringan.',
          clinicalTip: 'Rasa tawakal memberikan cognitive closure yang menurunkan hormon stres kortisol secara signifikan.',
        },
      ],
      safetyCautions: [
        'Jika selama sesi muncul ingatan traumatis yang sangat mengganggu, buka mata perlahan, minum air hangat, dan hubungi Bidan Pembina.',
      ],
    },
  },

  healing_touch: {
    moduleId: 'healing_touch',
    number: 3,
    badge: 'Dukungan Keluarga',
    title: 'Healing Touch Pendamping',
    subtitle: 'Sentuhan kasih & stimulasi hormon oksitosin bersama keluarga',
    video: {
      title: 'Tutorial Video: Titik Pijat Oksitosin Lembut untuk Suami & Pendamping',
      duration: '12:00',
      durationSeconds: 720,
      instructor: 'Bdn. Rina Marlina & Suami Pendamping',
      role: 'Bidan Konselor & Instruktur Family Centered Maternity Care',
      thumbnailGradient: 'from-amber-600 via-rose-600 to-pink-500',
      description: 'Panduan visual praktis untuk suami atau anggota keluarga dalam melakukan pijatan lembut di sepanjang tulang belakang dan bahu guna merangsang produksi hormon oksitosin dan meredakan nyeri punggung.',
      chapters: [
        { time: '00:00', seconds: 0, title: 'Menyiapkan Suasana & Kehangatan Tangan', detail: 'Minyak kelapa alami dan posisi duduk ibu yang rileks memeluk bantal.' },
        { time: '02:15', seconds: 135, title: 'Usapan Lembut Leher & Pundak', detail: 'Arah usapan memanjang dari tengkuk ke ujung bahu luar.' },
        { time: '05:30', seconds: 330, title: 'Pijatan Oksitosin Sepanjang Tulang Belakang', detail: 'Gunakan kedua jempol berjarak 2 jari di kanan-kiri tulang belakang.' },
        { time: '09:45', seconds: 585, title: 'Dekapan Hangat & Kalimat Penenang Suami', detail: 'Menghadirkan rasa aman dan didampingi secara utuh.' },
      ],
      keyVisualTips: [
        'Gerakan harus lembut dan mengalir, jangan menekan terlalu keras seperti pijat atletik.',
        'HANYA pijat area punggung, leher, dan bahu. DILARANG KERAS memijat area perut ibu!',
        'Pastikan kuku tangan pemijat dipotong rapi dan telapak tangan sudah digosok hangat.',
      ],
    },
    audio: {
      title: 'Audio Panduan Suara untuk Suami saat Melakukan Pijat',
      narrator: 'Bidan Konselor Keluarga TPMB',
      duration: '12:00',
      durationSeconds: 720,
      bgSound: 'Instrumen Hangat Relaksasi Akustik',
      frequency: 'Suara Panduan Tenang',
      overview: 'Memandu suami langkah demi langkah dengan hitungan ritmis, menjaga tempo pijatan tetap lambat, lembut, dan menenteramkan ibu.',
      scriptLines: [
        { time: '00:15', text: 'Bapak, gosokkan kedua telapak tangan hingga terasa hangat. Oleskan sedikit minyak alami.' },
        { time: '02:30', text: 'Letakkan kedua tangan di pundak istri. Tekan lembut dengan rasa sayang, putar perlahan 1... 2... 3...' },
        { time: '06:00', text: 'Kini pindah ke punggung, buat lingkaran kecil dengan jempol berjarak dua jari dari tulang belakang. Rasakan otot istri yang mulai rileks.' },
        { time: '10:00', text: 'Kini dekap istri Bapak dari belakang. Bisikkan: "Terima kasih sayang sudah mengandung/merawat buah hati kita."' },
      ],
    },
    text: {
      summary: 'Dukungan suami dan keluarga merupakan faktor protektif nomor satu pencegah depresi postpartum. Sentuhan fisik yang lembut memicu pengeluaran hormon oksitosin (hormon cinta) yang menurunkan tensi dan memperlancar produksi ASI.',
      benefits: [
        'Melancarkan let-down reflex ASI pada ibu nifas/menyusui.',
        'Meredakan ketegangan otot pinggang dan punggung akibat beban kehamilan.',
        'Mempererat kedekatan emosional suami-istri (marital satisfaction).',
        'Membantu ibu merasa dihargai, didengar, dan tidak berjuang sendirian.',
      ],
      preparation: [
        'Minyak alami: minyak zaitun murni, minyak kelapa virgin (VCO), atau baby oil hangat.',
        'Handuk kecil dan kursi nyaman atau matras bersandar bantal.',
        'Suasana tenang tanpa interupsi gawai atau televisi.',
      ],
      affirmationDoa: {
        title: 'Kalimat Penguatan untuk Suami kepada Istri',
        meaning: '"Terima kasih istriku tercinta. Perjuanganmu sangat luar biasa. Aku selalu ada di sisimu untuk menjagamu dan buah hati kita."',
        howToRecite: 'Bisikkan dengan lembut di telinga istri pada akhir sesi pemijatan.',
      },
      stepsDetailed: [
        {
          stepNumber: 1,
          title: 'Persiapan Suasana & Posisi Ibu',
          duration: '2 Menit',
          instruction: 'Ibu duduk bersandar di kursi dengan memeluk bantal di pangkuan, menunduk santai. Pendamping mencuci tangan dan menghangatkan telapak tangan dengan minyak.',
          clinicalTip: 'Posisi duduk condong ke depan membuka ruang antar ruas tulang belakang dada (vertebra torakal).',
        },
        {
          stepNumber: 2,
          title: 'Usapan Bahu & Leher',
          duration: '4 Menit',
          instruction: 'Letakkan kedua telapak tangan di pangkal leher, usap perlahan ke arah luar bahu dengan ritme teratur. Berikan tekanan lembut di otot trapezius.',
          clinicalTip: 'Menghilangkan kekakuan otot akibat postur menyusui dan beban payudara yang membesar.',
        },
        {
          stepNumber: 3,
          title: 'Pijatan Garis Oksitosin Punggung',
          duration: '4 Menit',
          instruction: 'Gunakan jempol kedua tangan, buat gerakan melingkar kecil dengan diameter 2-3 cm, mulai dari leher turun perlahan di kedua sisi tulang punggung hingga batas tali bra.',
          clinicalTip: 'Merangsang serabut saraf sensorik kutaneus yang mengirimkan sinyal ke hipotalamus untuk melepas oksitosin.',
        },
        {
          stepNumber: 4,
          title: 'Dekapan Hangat & Penutup',
          duration: '2 Menit',
          instruction: 'Rangkul ibu dari belakang, usap punggungnya secara memanjang dengan telapak tangan terbuka, dan ucapkan terima kasih atas perjuangannya.',
          clinicalTip: 'Skin-to-skin touch dan kehadiran afektif menurunkan hormon kortisol secara instan.',
        },
      ],
      partnerGuide: 'Panduan khusus ini ditujukan bagi suami, ibu kandung, atau mertua yang tinggal serumah dengan ibu.',
      safetyCautions: [
        'DILARANG keras memijat perut ibu hamil!',
        'Hindari tekanan keras pada tulang belakang langsung (hanya di otot sisi kanan dan kiri tulang).',
        'Jika ibu merasa mual atau tidak nyaman, segera hentikan.',
      ],
    },
  },

  blessing_water: {
    moduleId: 'blessing_water',
    number: 4,
    badge: 'Hidrasi & Mindful',
    title: 'Blessing Water (Hidrasi Berkesadaran)',
    subtitle: 'Niat kesembuhan & minum berkesadaran (Mindful Drinking)',
    video: {
      title: 'Video Demonstrasi Praktik Mindful Drinking & Menghayati Keberkahan Air',
      duration: '05:30',
      durationSeconds: 330,
      instructor: 'Bdn. Hj. Siti Rahma, S.Tr.Keb',
      role: 'Bidan Koordinator TPMB Mentari',
      thumbnailGradient: 'from-cyan-700 via-teal-600 to-sky-500',
      description: 'Panduan visual cara meminum air putih dengan penuh penghayatan, doa kebaikan, dan kesadaran inderawi untuk meredakan gelisah seketika dan menstabilkan sistem sirkulasi darah ibu.',
      chapters: [
        { time: '00:00', seconds: 0, title: 'Memegang Gelas dengan Kedua Tangan', detail: 'Merasakan suhu dan bobot air sebagai sumber kehidupan.' },
        { time: '01:30', seconds: 90, title: 'Membaca Doa & Meniatkan Kesembuhan', detail: 'Niat membersihkan racun emosi dan menghidrasi sel tubuh.' },
        { time: '03:00', seconds: 180, title: 'Tegukan Pertama Berkesadaran', detail: 'Menghayati aliran air yang menyejukkan tenggorokan dan dada.' },
        { time: '04:30', seconds: 270, title: 'Hening Bersyukur & Pelepasan Napas', detail: 'Rasa lega dan kesegaran yang memenuhi sekujur tubuh.' },
      ],
      keyVisualTips: [
        'Gunakan gelas kaca bening yang bersih.',
        'Minum dalam posisi duduk tenang, jangan sambil berdiri atau tergesa-gesa.',
      ],
    },
    audio: {
      title: 'Audio Panduan Hening Mindful Drinking & Doa Kesegaran Sel',
      narrator: 'Bidan Pembina MENTARI',
      duration: '05:00',
      durationSeconds: 300,
      bgSound: 'Gemercik Aliran Air Gunung Jernih & Lonceng Hening',
      frequency: 'Suara Alam Air Mengalir',
      overview: 'Menuntun ibu memperlambat ritme pikiran dengan fokus pada segelas air, mengubah rutinitas sederhana menjadi momen pemulihan batin yang menyegarkan.',
      scriptLines: [
        { time: '00:10', text: 'Pegang gelas ini dengan kedua belah tangan Ibu... Rasakan kesejukannya di telapak tangan.' },
        { time: '01:30', text: 'Tatap jernihnya air. Ucapkan doa: "Ya Allah, jadikan air ini penyejuk hatiku, pembersih cemas di dadaku."' },
        { time: '02:45', text: 'Teguk perlahan... Rasakan kesejukannya membasahi bibir, tenggorokan, dan mengalir menyejukkan batin.' },
        { time: '04:15', text: 'Alhamdulillah... Hembuskan napas panjang. Jiwa dan tubuh Ibu kini segar kembali.' },
      ],
    },
    text: {
      summary: 'Blessing Water memadukan anjuran medis hidrasi perinatal (kebutuhan 2,5 - 3 liter per hari) dengan teknik mindful drinking dan doa keberkahan. Dehidrasi ringan sering kali menjadi pemicu tersembunyi sakit kepala, lemas, dan kecemasan.',
      benefits: [
        'Mencegah dehidrasi yang memicu kram rahim atau kontraksi palsu.',
        'Membantu volume cairan ketuban (cairan amnion) tetap optimal.',
        'Menstabilkan tekanan darah dan sirkulasi darah plasenta.',
        'Memberikan jeda "grounding" saat emosi ibu sedang meluap.',
      ],
      preparation: [
        'Segelas air putih matang bersuhu sejuk atau hangat kuku (200-250 ml).',
        'Duduk di tempat yang tenang.',
      ],
      affirmationDoa: {
        title: 'Doa Minum Air Berkah & Kesembuhan',
        arabicOrFormula: 'اللَّهُمَّ اجْعَلْهُ شِفَاءً مِنْ كُلِّ دَاءٍ وَسَقَمٍ',
        meaning: '"Ya Allah, jadikanlah air ini sebagai penawar dan kesembuhan dari segala penyakit dan kegundahan."',
        howToRecite: 'Bacakan dengan lembut di dekat permukaan air sebelum tegukan pertama.',
      },
      stepsDetailed: [
        {
          stepNumber: 1,
          title: 'Memegang Gelas dengan Dua Tangan',
          duration: '45 Detik',
          instruction: 'Duduk tegak santai, genggam gelas air dengan kedua telapak tangan dekat dada. Rasakan kesejukan dan kejernihan air.',
          clinicalTip: 'Sentuhan dua tangan mengembalikan fokus persepsi propioseptif dan menurunkan ritme gelombang otak beta yang cemas.',
        },
        {
          stepNumber: 2,
          title: 'Doa Niat Kesegaran & Pemulihan',
          duration: '1 Menit',
          instruction: 'Niatkan air ini membawa kesembuhan, membersihkan lelah, dan mengalirkan rahmat ke setiap sel tubuh ibu dan janin/bayi.',
          clinicalTip: 'Memberi makna spiritual pada aktivitas sehari-hari meningkatkan neuroplastisitas ketenangan batin.',
        },
        {
          stepNumber: 3,
          title: 'Tegukan Pertama Berkesadaran',
          duration: '1.5 Menit',
          instruction: 'Minum seteguk demi seteguk secara perlahan (3-5 tegukan). Rasakan aliran air saat membasahi lidah, tenggorokan, dan menyejukkan dada.',
          clinicalTip: 'Menelan air perlahan menstimulasi reflek vagal yang menurunkan frekuensi detak jantung.',
        },
        {
          stepNumber: 4,
          title: 'Hening Bersyukur',
          duration: '1.5 Menit',
          instruction: 'Letakkan kembali gelas. Tarik napas dalam dan hembuskan dengan senyuman syukur atas anugerah kehidupan hari ini.',
          clinicalTip: 'Mengakhiri dengan rasa syukur memicu pelepasan dopamine yang menumbuhkan rasa puas dan bahagia.',
        },
      ],
      safetyCautions: [
        'Gunakan air matang higienis.',
        'Jangan minum terburu-buru atau dalam jumlah sangat banyak sekaligus agar tidak tersedak atau mual kembung.',
      ],
    },
  },

  pendampingan: {
    moduleId: 'pendampingan',
    number: 5,
    badge: 'Dukungan Klinis',
    title: 'Pendampingan Personal Bidan',
    subtitle: 'Sesi konseling terstruktur 1-on-1 dengan Bidan TPMB',
    video: {
      title: 'Video Informasi: Kapan & Bagaimana Sesi Konseling 1-on-1 dengan Bidan',
      duration: '06:45',
      durationSeconds: 405,
      instructor: 'Bdn. Hj. Siti Rahma, S.Tr.Keb & Tim Bidan',
      role: 'Bidan Penanggung Jawab TPMB Mentari',
      thumbnailGradient: 'from-blue-700 via-sky-700 to-indigo-600',
      description: 'Penjelasan hangat mengenai apa saja yang bisa Ibu diskusikan dengan Bidan saat sesi pendampingan, bagaimana kerahasiaan Ibu dijaga sepenuhnya, serta opsi tatap muka di klinik maupun panggilan telepon.',
      chapters: [
        { time: '00:00', seconds: 0, title: 'Salam Hangat & Ruang Aman Ibu', detail: 'Bidan hadir bukan untuk menghakimi, melainkan mendengarkan dengan penuh empati.' },
        { time: '02:00', seconds: 120, title: 'Topik yang Bisa Dicurahkan', detail: 'Kecemasan persalinan, lelah menyusui, hubungan dengan suami, hingga rasa sedih mendalam.' },
        { time: '03:45', seconds: 225, title: 'Konseling Tatap Muka vs Daring', detail: 'Kenyamanan ibu menjadi prioritas utama pemilihan metode.' },
        { time: '05:10', seconds: 310, title: 'Langkah Mengajukan Jadwal Konsultasi', detail: 'Cara mudah memilih hari dan jam temu lewat aplikasi MENTARI.' },
      ],
      keyVisualTips: [
        'Konsultasi bersifat 100% rahasia medis.',
        'Ibu berhak mengajak suami atau keluarga jika merasa lebih nyaman didampingi.',
      ],
    },
    audio: {
      title: 'Pesan Sambutan Hangat & Penguatan Batin dari Bidan TPMB',
      narrator: 'Bidan Pembina TPMB Mentari',
      duration: '05:00',
      durationSeconds: 300,
      bgSound: 'Melodi Lembut Penenteram Jiwa',
      frequency: 'Percakapan Empatik Bidan',
      overview: 'Pesan audio personal yang menenangkan, meyakinkan ibu bahwa wajar merasa lelah dan meminta bantuan adalah tanda keberanian seorang ibu yang hebat.',
      scriptLines: [
        { time: '00:10', text: 'Halo Ibu sayang... Ini Bidan TPMB. Saya ingin Ibu tahu, Ibu tidak sendirian.' },
        { time: '01:30', text: 'Menjadi ibu adalah perjalanan besar yang penuh tantangan. Bila Ibu merasa berat atau ingin menangis, jangan ditahan ya bu.' },
        { time: '03:00', text: 'Pintu klinik kami dan nomor telepon kami selalu terbuka untuk mendengar cerita Ibu tanpa prasangka.' },
        { time: '04:15', text: 'Yuk, jadwalkan waktu kita ngobrol santai. Kita cari solusi bersama agar Ibu kembali tersenyum lega.' },
      ],
    },
    text: {
      summary: 'Komponen kelima SICRING merupakan jangkar klinis yang menghubungkan latihan mandiri dengan dukungan profesional. Bidan TPMB terlatih melakukan triase empati, validasi emosi, konseling kebidanan perinatal, dan rujukan kolaboratif jika diperlukan.',
      benefits: [
        'Mendapatkan telinga yang mendengar tanpa stigma atau penghakiman.',
        'Pemeriksaan fisik komprehensif bersamaan dengan konseling psikologis.',
        'Rencana tindak lanjut (action plan) perawatan diri yang realistis sesuai kondisi rumah tangga.',
        'Akses rujukan cepat ke psikolog klinis / dokter spesialis jika skor EPDS membutuhkan penanganan lanjutan.',
      ],
      preparation: [
        'Catat keluhan fisik atau rasa batin yang paling mengganggu Ibu dalam 7 hari terakhir.',
        'Siapkan buku KIA dan catatan riwayat pemeriksaan sebelumnya.',
      ],
      affirmationDoa: {
        title: 'Pengingat Kasih untuk Ibu',
        meaning: '"Meminta pertolongan bukanlah tanda kelemahan, melainkan bukti keberanian seorang ibu untuk menjaga dirinya demi buah hati tercinta."',
        howToRecite: 'Ingatlah selalu kalimat ini saat ragu menghubungi bidan.',
      },
      stepsDetailed: [
        {
          stepNumber: 1,
          title: 'Pemilihan Jadwal & Metode',
          duration: 'Fleksibel',
          instruction: 'Pilih jadwal temu tatap muka di klinik TPMB atau sesi telepon privat dari rumah sesuai kenyamanan waktu istirahat Ibu.',
          clinicalTip: 'Fleksibilitas metode meningkatkan kepatuhan kehadiran ibu (adherence rate).',
        },
        {
          stepNumber: 2,
          title: 'Sesi Mendengarkan Empatik',
          duration: '15-20 Menit',
          instruction: 'Bidan memberikan ruang seluas-luasnya bagi Ibu untuk menumpahkan unek-unek tanpa dipotong atau dihakimi.',
          clinicalTip: 'Teknik active listening dan verbal ventilation menurunkan beban emosional secara instan.',
        },
        {
          stepNumber: 3,
          title: 'Diskusi Solusi & Asuhan Kebidanan',
          duration: '10 Menit',
          instruction: 'Bidan mengidentifikasi faktor pemicu stres (misal: kurang tidur, masalah pelekatan menyusui, atau kelelahan fisik) dan memberikan panduan praktis.',
          clinicalTip: 'Intervensi berorientasi pemecahan masalah (problem-focused coping) mengembalikan rasa kendali ibu (sense of agency).',
        },
        {
          stepNumber: 4,
          title: 'Kesepakatan Rencana Pendampingan',
          duration: '5 Menit',
          instruction: 'Menyepakati jadwal pemantauan lanjutan dan nomor kontak darurat jika ibu membutuhkan dukungan mendesak sewaktu-waktu.',
          clinicalTip: 'Safety net yang jelas memberikan rasa aman psikologis yang berkelanjutan.',
        },
      ],
      safetyCautions: [
        'Jika Ibu merasakan dorongan kuat untuk menyakiti diri sendiri atau bayi, jangan tunggu jadwal temu. Segera tekan tombol Bantuan Darurat Bidan!',
      ],
    },
  },
};
