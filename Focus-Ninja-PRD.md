# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# FOCUS NINJA: TAKLUKKAN DISTRAKSI!

**Product Type:** Educational 3D Endless Runner Game  
**Platform:** Web Application (Desktop Browser)  
**Category:** Educational Game / Guidance and Counseling (BK)  
**Primary Input:** Webcam-Based Full-Body Movement Tracking  
**Technology:** HTML, CSS, JavaScript, Three.js, MediaPipe Pose Landmarker  
**Document Version:** 1.0  
**Status:** Development Specification

---

# 1. PRODUCT OVERVIEW

## 1.1 Product Description

Focus Ninja: Taklukkan Distraksi! adalah sebuah permainan edukasi berbasis website yang menggabungkan konsep 3D endless runner dengan teknologi computer vision untuk membantu siswa memahami pentingnya konsentrasi, perhatian, dan strategi belajar yang efektif.

Permainan mengadaptasi mekanisme gameplay seperti Subway Surfers, dengan karakter utama berupa ninja bergaya cute chibi yang berlari secara otomatis melewati berbagai rintangan.

Berbeda dari permainan endless runner pada umumnya, Focus Ninja menggunakan webcam sebagai perangkat input utama. Pemain mengontrol karakter melalui gerakan seluruh tubuh, termasuk pergeseran badan, gerakan tangan, jongkok, dan lompatan.

Pemain harus mengumpulkan objek yang berkaitan dengan kegiatan belajar, menghindari objek pengganggu, serta menyelesaikan tantangan yang berkaitan dengan situasi belajar sehari-hari.

Setiap level dirancang untuk memberikan pengalaman bermain sekaligus pembelajaran mengenai kemampuan mengenali distraksi dan menerapkan strategi belajar yang efektif.

## 1.2 Problem Statement

Banyak siswa mengalami kesulitan mempertahankan konsentrasi ketika belajar akibat berbagai faktor, seperti:

- Gangguan notifikasi smartphone.
- Kebiasaan membuka media sosial.
- Lingkungan belajar yang kurang kondusif.
- Kesulitan mengatur waktu belajar.
- Kurangnya kemampuan menentukan prioritas.

Media edukasi yang hanya mengandalkan teks dan penjelasan terkadang kurang menarik bagi siswa.

Focus Ninja hadir sebagai alternatif media pembelajaran BK yang lebih interaktif melalui permainan berbasis gerakan tubuh.

## 1.3 Product Vision

Menciptakan media edukasi BK yang menyenangkan, interaktif, dan inovatif dengan menggabungkan teknologi web 3D dan body movement tracking untuk membantu siswa memahami serta menerapkan kebiasaan belajar yang lebih fokus.

## 1.4 Product Objectives

1. Mengenalkan pentingnya konsentrasi dalam kegiatan belajar.
2. Membantu siswa mengenali berbagai bentuk distraksi.
3. Melatih kemampuan memperhatikan dan mengambil keputusan.
4. Mengenalkan strategi belajar yang efektif.
5. Menghadirkan pengalaman belajar interaktif melalui aktivitas fisik.

---

# 2. TARGET USERS

## 2.1 Primary Users

Siswa Sekolah Menengah Pertama (SMP) dan Sekolah Menengah Atas/Kejuruan (SMA/SMK).

Karakteristik pengguna:

- Terbiasa menggunakan komputer dan browser.
- Menyukai permainan interaktif.
- Membutuhkan media pembelajaran yang tidak monoton.
- Memiliki pengalaman berbeda dalam mengelola konsentrasi belajar.

## 2.2 Secondary Users

Guru Bimbingan dan Konseling (BK).

Kebutuhan:

- Menggunakan game sebagai media pendukung layanan BK.
- Membantu siswa memahami materi konsentrasi.
- Menggunakan hasil permainan sebagai bahan refleksi dan diskusi.

---

# 3. PRODUCT SCOPE

## 3.1 Core Features

| Fitur | Deskripsi |
|---|---|
| Main Menu | Halaman utama permainan |
| Webcam Integration | Mengakses kamera pemain |
| Body Calibration | Mengatur posisi awal dan sensitivitas gerakan |
| Full-Body Tracking | Membaca gerakan tubuh pemain |
| 3D Endless Runner | Gameplay berlari dengan tiga jalur |
| Obstacle System | Sistem rintangan dan distraksi |
| Collectible System | Mengumpulkan objek pembelajaran |
| Level System | Tiga tingkat permainan |
| Scoring System | Menghitung skor permainan |
| BK Learning System | Pertanyaan dan edukasi BK |
| Result Screen | Menampilkan hasil permainan |
| Reflection System | Refleksi dan tips belajar |

## 3.2 Out of Scope (Initial Release)

Fitur berikut tidak menjadi prioritas pada versi pertama:

- Multiplayer online.
- Sistem akun dan autentikasi.
- Leaderboard online.
- Penyimpanan data berbasis cloud.
- Integrasi VR.
- Character customization.
- Pembelian item dalam game.

Fokus pengembangan awal adalah menghasilkan pengalaman permainan single-player yang stabil dan dapat dimainkan melalui webcam.

---

# 4. TECHNOLOGY STACK

## 4.1 Frontend

**HTML5**
- Struktur halaman website.
- Elemen antarmuka permainan.
- Integrasi elemen video webcam.

**CSS3**
- Styling antarmuka.
- Responsive layout.
- Animasi transisi UI.
- HUD dan komponen visual.

**JavaScript (ES Modules)**
- Game logic.
- Gameplay mechanics.
- Collision detection.
- Motion controller.
- Level management.

## 4.2 3D Game Engine

**Three.js**

Digunakan untuk:

- Membuat 3D scene.
- Mengatur kamera third-person.
- Memuat model karakter 3D.
- Mengatur environment.
- Membuat objek obstacle dan collectible.
- Mengatur lighting dan shadow.
- Menjalankan animasi karakter.

Official documentation: https://threejs.org/

## 4.3 Body Tracking

**MediaPipe Pose Landmarker**

Digunakan untuk mendeteksi landmark tubuh melalui webcam.

Fungsi utama:

- Mendeteksi posisi kepala.
- Mendeteksi posisi bahu.
- Mendeteksi posisi siku dan pergelangan tangan.
- Mendeteksi posisi pinggul.
- Mendeteksi posisi lutut.
- Mendeteksi posisi pergelangan kaki.
- Mengidentifikasi perubahan posisi tubuh.

Documentation: https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker/web_js

## 4.4 Development Tools

| Teknologi | Kegunaan |
|---|---|
| Vite | Development server dan build tool |
| GLB / GLTF | Format model 3D |
| Mixamo | Referensi dan sumber animasi karakter |
| Web Audio API | Audio dan sound effects |
| Git | Version control |

## 4.5 Technical Architecture

Alur utama aplikasi:

Webcam → MediaPipe Pose Landmarker → Motion Controller → Game Controller → Three.js Scene → Gameplay Response.

Seluruh proses body tracking dilakukan di browser. Tidak diperlukan server khusus untuk memproses video pemain.

---

# 5. GAMEPLAY DESIGN

## 5.1 Game Perspective

Game menggunakan perspektif **Third-Person Follow Camera**.

Karakter ninja terlihat dari belakang dan berlari secara otomatis menuju bagian depan lintasan.

Karakter bergerak di atas tiga jalur:

- Left Lane.
- Center Lane.
- Right Lane.

Kamera mengikuti pergerakan karakter dengan sudut pandang sedikit tinggi agar pemain dapat melihat rintangan yang mendekat.

## 5.2 Core Gameplay Loop

1. Pemain membuka website Focus Ninja.
2. Pemain memilih menu Play.
3. Website meminta izin akses webcam.
4. Pemain melakukan body calibration.
5. Pemain memulai level.
6. Karakter ninja berlari otomatis.
7. Pemain mengontrol karakter menggunakan gerakan tubuh.
8. Pemain mengumpulkan objek belajar.
9. Pemain menghindari rintangan dan distraksi.
10. Permainan selesai ketika pemain mencapai kondisi akhir level atau kehabisan kesempatan.
11. Website menampilkan skor, evaluasi, dan pembelajaran BK.

## 5.3 Movement System

Gerakan tubuh menjadi input utama permainan.

| Gerakan Tubuh | Aksi Karakter |
|---|---|
| Badan bergeser ke kiri | Pindah ke jalur kiri |
| Badan bergeser ke kanan | Pindah ke jalur kanan |
| Jongkok | Slide |
| Melompat | Jump |
| Kedua tangan diangkat | Aktivasi skill khusus (opsional) |
| Posisi tubuh kembali normal | Kembali ke posisi netral |

Catatan implementasi:

- Gunakan posisi pinggul dan bahu untuk mendeteksi pergeseran tubuh.
- Gunakan perubahan posisi pinggul, lutut, dan pergelangan kaki untuk mendeteksi jongkok dan lompatan.
- Gerakan harus dinormalisasi berdasarkan hasil kalibrasi pemain.
- Gunakan threshold dan cooldown untuk menghindari input berulang.
- Sediakan pengaturan sensitivitas gerakan.
- Jangan mengharuskan pemain melakukan gerakan ekstrem.

## 5.4 Motion Detection Logic

Setiap gerakan harus melalui beberapa tahap:

1. Webcam menangkap video pemain.
2. MediaPipe mendeteksi landmark tubuh.
3. Motion Controller membaca posisi landmark.
4. Sistem menghitung perubahan posisi terhadap posisi netral.
5. Sistem mengidentifikasi jenis gerakan.
6. Game Controller menerima perintah.
7. Karakter menjalankan animasi yang sesuai.

Gunakan smoothing atau filtering agar gerakan tidak terlalu sensitif terhadap perubahan kecil.

Tambahkan state detection agar satu gerakan tidak menghasilkan banyak perintah dalam waktu singkat.

## 5.5 Calibration System

Sebelum permainan dimulai, pemain harus melewati halaman Body Calibration.

Tahapan:

1. Meminta izin kamera.
2. Menampilkan preview webcam.
3. Memastikan seluruh tubuh terlihat.
4. Mendeteksi landmark tubuh.
5. Meminta pemain berdiri dalam posisi normal.
6. Menyimpan baseline posisi tubuh sementara.
7. Menguji gerakan kiri, kanan, jongkok, dan lompat.
8. Menampilkan indikator apakah gerakan berhasil terdeteksi.

Jika tubuh tidak terdeteksi dengan baik, pemain diminta menyesuaikan posisi kamera.

---

# 6. LEVEL DESIGN

Focus Ninja memiliki tiga level utama dengan tema, tingkat kesulitan, dan tujuan pembelajaran berbeda.

## 6.1 LEVEL 1 — FOCUS TRAINING

**Difficulty:** Easy

**Environment:** Bamboo Forest

**Mission:** Mengenali objek yang berkaitan dengan kegiatan belajar.

Gameplay:

- Karakter berlari dengan kecepatan rendah.
- Objek muncul secara bertahap.
- Pemain harus mengumpulkan buku dan alat tulis.
- Pemain harus menghindari objek distraksi.
- Pemain mempelajari kontrol gerakan tubuh.

Collectible:

- Buku.
- Pensil.
- Penggaris.
- Bintang.

Obstacle:

- Wooden Barrier.
- Crates.
- Barrels.

Learning Objective:

Mengenalkan perbedaan antara objek yang mendukung kegiatan belajar dan objek yang berpotensi menjadi distraksi.

## 6.2 LEVEL 2 — DODGE THE DISTRACTION

**Difficulty:** Medium

**Environment:** Distracted City

**Mission:** Mengenali gangguan yang dapat menghambat kegiatan belajar.

Gameplay:

- Kecepatan karakter meningkat.
- Objek muncul lebih cepat.
- Distraksi semakin beragam.
- Pemain harus menghindari monster notifikasi dan smartphone.
- Pemain harus lebih cepat mengambil keputusan.

Obstacle:

- Phone Monster.
- Notification Monster.
- Hanging Obstacle.
- Spiked Roller.
- Moving Barrier.

Collectible:

- Buku.
- Pensil.
- Knowledge Orb.
- Focus Orb.

BK Challenge:

Setelah menyelesaikan tantangan, tampilkan pertanyaan:

"Ketika sedang belajar, notifikasi ponsel terus muncul. Apa yang bisa kamu lakukan agar tetap fokus?"

Pilihan jawaban:

A. Membuka semua notifikasi terlebih dahulu.

B. Menonaktifkan notifikasi sementara selama belajar.

C. Menghentikan kegiatan belajar.

D. Membuka media sosial sebentar.

Jawaban terbaik: B.

Berikan penjelasan singkat mengenai alasan pemilihan jawaban.

## 6.3 LEVEL 3 — FOCUS MASTER

**Difficulty:** Hard

**Environment:** Ninja Temple

**Mission:** Menerapkan strategi belajar efektif.

Gameplay:

- Kombinasi seluruh obstacle dari level sebelumnya.
- Kecepatan permainan lebih tinggi.
- Pola rintangan lebih kompleks.
- Pemain harus mempertahankan fokus.
- Tantangan pengambilan keputusan diberikan pada akhir permainan.

BK Challenge:

"Kamu harus menyelesaikan tugas dalam waktu dua jam. Namun, kamu terus tergoda membuka media sosial. Apa yang sebaiknya kamu lakukan?"

Pilihan strategi:

A. Membagi tugas menjadi beberapa bagian.

B. Menonaktifkan notifikasi sementara.

C. Menentukan waktu khusus untuk beristirahat.

D. Menggabungkan beberapa strategi di atas.

Jawaban terbaik: D.

Berikan penjelasan mengenai manfaat membagi tugas, mengurangi distraksi, dan mengatur waktu istirahat.

---

# 7. SCORING SYSTEM

Sistem skor digunakan untuk memberikan feedback atas performa pemain selama permainan.

Contoh perhitungan:

| Aktivitas | Poin |
|---|---:|
| Mengumpulkan buku | +100 |
| Mengumpulkan pensil | +50 |
| Mengumpulkan Focus Orb | +150 |
| Menghindari distraksi | Tidak ada penalti |
| Menabrak obstacle | -50 |
| Mengambil objek distraksi | -30 |
| Menyelesaikan level | Bonus +300 |

Angka di atas merupakan nilai awal dan dapat disesuaikan selama playtesting.

## 7.1 Performance Metrics

Hasil permainan menampilkan:

- Total Score.
- Collected Learning Items.
- Collected Distracting Items.
- Obstacle Hits.
- Successful Dodges.
- Reaction Performance.
- Level Completion Status.

Jangan menyamakan skor permainan dengan pengukuran konsentrasi klinis. Data hanya menggambarkan performa pemain dalam sesi permainan.

## 7.2 Ninja Rank

Gunakan sistem peringkat:

- Beginner Ninja.
- Focus Ninja.
- Master Ninja.
- Focus Legend.

Peringkat dihitung berdasarkan performa keseluruhan dengan batas skor yang dapat dikonfigurasi.

---

# 8. BK LEARNING SYSTEM

Bagian ini menjadi pembeda utama Focus Ninja dari game endless runner biasa.

## 8.1 Learning Reflection

Setelah menyelesaikan setiap level, tampilkan pertanyaan refleksi yang relevan dengan materi.

Contoh:

- Apa saja hal yang sering mengganggu konsentrasi ketika belajar?
- Mengapa notifikasi smartphone dapat mengalihkan perhatian?
- Bagaimana cara menciptakan lingkungan belajar yang kondusif?
- Mengapa membagi tugas menjadi beberapa bagian dapat membantu proses belajar?

## 8.2 Learning Tips

Berikan tips praktis berdasarkan materi permainan.

Contoh:

**Tips 1 — Kurangi Distraksi**

Matikan notifikasi yang tidak penting ketika sedang belajar.

**Tips 2 — Gunakan Teknik Pomodoro**

Belajar selama 25 menit dan beristirahat selama 5 menit sebagai salah satu alternatif pengaturan waktu belajar.

**Tips 3 — Buat Prioritas**

Selesaikan tugas berdasarkan tingkat kepentingan dan tenggat waktu.

**Tips 4 — Ciptakan Lingkungan Kondusif**

Pilih tempat belajar yang nyaman dan minim gangguan.

## 8.3 Learning Result

Setelah menyelesaikan seluruh level, tampilkan ringkasan:

- Level yang berhasil diselesaikan.
- Total skor.
- Pencapaian permainan.
- Pertanyaan refleksi.
- Strategi belajar yang dipelajari.
- Rekomendasi kebiasaan belajar.

---

# 9. UI/UX DESIGN REQUIREMENTS

## 9.1 Design Direction

Focus Ninja menggunakan visual style:

**Cute Stylized 3D / Chibi Ninja / Japanese Fantasy.**

Karakteristik desain:

- Karakter ninja bergaya chibi.
- Bentuk objek membulat dan ramah.
- Warna cerah dengan kontras yang jelas.
- Environment bergaya low-poly.
- Elemen visual bernuansa Jepang.
- UI bergaya colorful gaming interface.
- Komponen memiliki sudut membulat.
- Animasi UI halus dan responsif.

## 9.2 Design References — Mandatory

**PENTING: Gunakan seluruh gambar asset design yang sudah disediakan dalam percakapan sebagai referensi visual utama project Focus Ninja.**

AI Developer harus mempelajari gambar referensi sebelum membuat komponen UI dan visual game.

Jangan mengubah identitas visual secara sembarangan.

### Reference 01 — Character Design

**Asset Reference:** Focus Ninja Character Sheet.

Isi referensi:

- Desain karakter ninja utama.
- Model turnaround.
- Ekspresi karakter.
- Pose Idle.
- Pose Running.
- Pose Jump.
- Pose Sliding.
- Pose Victory.
- Pose Hit.
- Color palette karakter.

Penggunaan:

- Menentukan desain karakter utama.
- Menjaga konsistensi karakter.
- Menentukan animasi dan ekspresi.
- Menjadi acuan model 3D ninja.

### Reference 02 — Environment Design

**Asset Reference:** Focus Ninja Environment Asset Sheet.

Isi referensi:

- Level 1 — Bamboo Forest.
- Level 2 — Distracted City.
- Level 3 — Ninja Temple.
- Modular Track Pieces.
- Environment Props.
- Decorations.
- Background Elements.
- Sky & Atmosphere.

Penggunaan:

- Menentukan desain environment setiap level.
- Menentukan material dan warna lingkungan.
- Membuat modular track.
- Menentukan dekorasi dan suasana setiap level.

### Reference 03 — Obstacle Design

**Asset Reference:** Focus Ninja Obstacle Assets.

Isi referensi:

- Running Obstacles.
- Jump Obstacles.
- Slide Obstacles.
- Enemy / Distraction.
- Hazard.
- Special Obstacles.

Penggunaan:

- Menentukan bentuk dan visual obstacle.
- Menentukan kategori rintangan.
- Menentukan interaksi rintangan dengan karakter.
- Menjaga konsistensi visual semua objek.

### Reference 04 — Collectible Design

**Asset Reference:** Focus Ninja Collectible Assets.

Isi referensi:

- Books.
- Stationery.
- Knowledge Items.
- Power-Ups.
- Coins & Rewards.
- Bonus Items.

Penggunaan:

- Menentukan desain objek yang dikumpulkan.
- Menentukan visual power-up.
- Menentukan efek collectible.
- Menentukan identitas visual item pembelajaran.

### Reference 05 — Game UI Design

**Asset Reference:** Focus Ninja UI Game Assets.

Ini merupakan referensi paling penting untuk pengembangan antarmuka.

Isi referensi:

- Main Menu UI.
- In-Game HUD.
- Pause Menu.
- Game Over Screen.
- Level Complete Screen.
- Tutorial / Tips Panel.
- Settings Panel.
- Icon Set.
- Button Components.
- Overlay & Frame.
- Other UI Elements.

**Instruksi wajib:**

1. Jadikan gambar UI reference sebagai acuan utama.
2. Pertahankan komposisi, hierarki visual, warna, bentuk tombol, panel, dan karakteristik ilustrasi.
3. Jangan membuat desain UI baru yang bertentangan dengan referensi.
4. Adaptasikan elemen referensi menjadi komponen HTML dan CSS yang benar-benar berfungsi.
5. Jangan menggunakan seluruh gambar reference sebagai satu background statis.
6. Buat komponen UI terpisah agar dapat digunakan kembali.
7. Pastikan UI tidak menutupi area gameplay.
8. Gunakan font, spacing, dan ukuran komponen yang konsisten.

## 9.3 UI Components

| Komponen | Fungsi |
|---|---|
| Logo | Identitas Focus Ninja |
| Play Button | Memulai permainan |
| Settings Button | Pengaturan permainan |
| Tutorial Button | Petunjuk bermain |
| Pause Button | Menghentikan permainan sementara |
| Score HUD | Menampilkan skor |
| Coin HUD | Menampilkan collectible |
| Health Indicator | Menampilkan kesempatan bermain |
| Level Progress | Menampilkan progres level |
| Result Panel | Menampilkan hasil permainan |
| Reflection Panel | Menampilkan refleksi BK |

## 9.4 Main Navigation Flow

Main Menu → Level Selection → Camera Permission → Body Calibration → Gameplay → BK Challenge → Result Screen → Learning Reflection.

Pemain juga harus dapat kembali ke menu utama dan mengulang level.

---

# 10. USER EXPERIENCE FLOW

## 10.1 Main Menu

Tampilan utama berisi:

- Logo Focus Ninja.
- Karakter ninja.
- Background environment.
- Play.
- Tutorial.
- Settings.

## 10.2 Tutorial

Tampilkan instruksi sederhana mengenai:

- Cara menggunakan webcam.
- Cara berdiri di depan kamera.
- Cara berpindah jalur.
- Cara melompat.
- Cara jongkok.
- Cara mengumpulkan objek.
- Cara menghindari distraksi.

## 10.3 Camera Setup

Tampilkan:

- Webcam preview.
- Status camera connection.
- Body detection indicator.
- Full-body visibility indicator.
- Calibration button.

Jangan memulai permainan sebelum izin kamera diberikan dan tubuh berhasil terdeteksi.

## 10.4 Gameplay HUD

Tampilkan:

- Current Score.
- Collectible Counter.
- Health / Life.
- Level Progress.
- Pause Button.

## 10.5 Pause Menu

Pilihan:

- Resume.
- Restart.
- Settings.
- Main Menu.

## 10.6 Result Screen

Tampilkan:

- Total Score.
- Ninja Rank.
- Collectible Summary.
- Obstacle Summary.
- Level Status.
- Continue Button.
- Retry Button.
- Main Menu Button.

---

# 11. GAME MECHANICS

## 11.1 Endless Runner System

Karakter berjalan otomatis ke depan.

Gunakan sistem modular track agar environment dapat dibuat berulang tanpa harus memuat seluruh lintasan sekaligus.

Fitur:

- Three-lane movement.
- Automatic running.
- Obstacle spawning.
- Collectible spawning.
- Increasing difficulty.
- Collision detection.
- Level progression.

## 11.2 Difficulty Progression

Kesulitan meningkat secara bertahap berdasarkan progres permainan.

Parameter yang dapat berubah:

- Running speed.
- Obstacle frequency.
- Collectible frequency.
- Obstacle combinations.
- Reaction time requirements.

Pastikan tingkat kesulitan tetap wajar untuk pengguna sekolah.

## 11.3 Collision System

Terdapat tiga jenis interaksi:

**Collectible Collision**

Ketika karakter menyentuh collectible, item akan menghilang dan skor bertambah.

**Obstacle Collision**

Ketika karakter menabrak obstacle, kesempatan bermain berkurang atau skor terkena penalti.

**Distraction Collision**

Ketika karakter menyentuh objek distraksi, pemain mendapatkan penalti sesuai aturan level.

---

# 12. TECHNICAL REQUIREMENTS

## 12.1 Performance

Target awal:

- Gameplay target 60 FPS pada perangkat yang memenuhi spesifikasi.
- Body tracking berjalan secara real-time.
- UI tidak menghambat rendering game.
- Asset dimuat secara efisien.
- Gunakan texture dan polygon count yang dioptimalkan.

Target FPS merupakan sasaran pengembangan, bukan jaminan untuk seluruh perangkat.

## 12.2 Browser Compatibility

Target browser:

- Google Chrome.
- Microsoft Edge.

Platform utama:

- Windows Desktop / Laptop.
- Webcam internal atau webcam eksternal.

## 12.3 Camera Requirements

- Akses webcam menggunakan browser permission.
- Memerlukan HTTPS pada deployment atau localhost untuk development.
- Seluruh tubuh pemain harus terlihat.
- Pencahayaan harus memadai.
- Video tidak dikirim ke server.
- Kamera dapat dinonaktifkan kapan saja.

## 12.4 Privacy

- Tidak menyimpan rekaman video pemain.
- Pemrosesan pose dilakukan secara lokal di browser.
- Tidak mengunggah gambar webcam.
- Tampilkan informasi penggunaan kamera secara jelas.
- Hentikan camera stream ketika pemain meninggalkan mode permainan.

## 12.5 Fallback Controls

Selama development, sediakan keyboard control sebagai alat pengujian.

Contoh:

- Arrow Left: Move Left.
- Arrow Right: Move Right.
- Arrow Up / Space: Jump.
- Arrow Down: Slide.
- Escape: Pause.

Keyboard control bukan metode utama permainan, melainkan fallback untuk debugging dan pengujian.

---

# 13. ASSET MANAGEMENT

## 13.1 Asset Formats

| Asset | Format |
|---|---|
| 3D Character | GLB / GLTF |
| 3D Environment | GLB / GLTF |
| 3D Obstacle | GLB / GLTF |
| Collectible | GLB / GLTF |
| UI Illustration | PNG / WebP |
| Icon | SVG / PNG |
| Audio | MP3 / OGG |
| Texture | PNG / WebP |

## 13.2 Asset Implementation Guidelines

- Gunakan asset 3D yang konsisten dengan visual reference.
- Jangan menggunakan gambar 2D character sheet sebagai model karakter 3D.
- Gunakan model karakter yang memiliki rig dan animasi.
- Gunakan modular environment.
- Gunakan reusable components untuk UI.
- Gunakan fallback geometry jika model belum tersedia.
- Hindari membuat seluruh asset dalam satu model besar yang sulit dikelola.

**Catatan penting:** Gambar character, environment, obstacle, collectible, dan UI yang tersedia merupakan visual reference sheet. Asset tersebut bukan otomatis model 3D game-ready. Developer harus membuat atau memperoleh model 3D aktual untuk kebutuhan Three.js.

---

# 14. PROJECT STRUCTURE

Gunakan struktur project modular berikut:

focus-ninja/

├── public/

│   ├── models/

│   │   ├── characters/

│   │   ├── environment/

│   │   ├── obstacles/

│   │   └── collectibles/

│   ├── textures/

│   ├── images/

│   ├── audio/

│   └── mediapipe/

│

├── src/

│   ├── game/

│   │   ├── Game.js

│   │   ├── Scene.js

│   │   ├── Camera.js

│   │   ├── Player.js

│   │   ├── Environment.js

│   │   ├── ObstacleManager.js

│   │   ├── CollectibleManager.js

│   │   ├── Collision.js

│   │   └── GameController.js

│   │

│   ├── motion/

│   │   ├── PoseTracker.js

│   │   ├── MotionController.js

│   │   ├── Calibration.js

│   │   └── GestureDetector.js

│   │

│   ├── levels/

│   │   ├── LevelManager.js

│   │   ├── Level1.js

│   │   ├── Level2.js

│   │   └── Level3.js

│   │

│   ├── systems/

│   │   ├── ScoreManager.js

│   │   ├── AudioManager.js

│   │   ├── InputManager.js

│   │   └── AssetManager.js

│   │

│   ├── ui/

│   │   ├── MainMenu.js

│   │   ├── Tutorial.js

│   │   ├── CameraSetup.js

│   │   ├── HUD.js

│   │   ├── PauseMenu.js

│   │   ├── ResultScreen.js

│   │   └── ReflectionPanel.js

│   │

│   ├── styles/

│   │   ├── main.css

│   │   ├── menu.css

│   │   ├── game.css

│   │   └── components.css

│   │

│   └── main.js

│

├── index.html

├── package.json

└── vite.config.js

Struktur ini dapat disesuaikan selama implementasi, tetapi pemisahan antara game engine, motion tracking, UI, dan level management harus dipertahankan.

---

# 15. DEVELOPMENT ROADMAP

Pengembangan dilakukan secara bertahap.

## Phase 1 — Project Foundation

- Setup Vite.
- Setup Three.js.
- Membuat struktur project.
- Membuat 3D scene.
- Membuat third-person camera.
- Membuat track tiga jalur.

Deliverable: 3D prototype.

## Phase 2 — Character & Gameplay

- Integrasi model ninja.
- Integrasi running animation.
- Sistem perpindahan lane.
- Jump dan slide.
- Collision detection.
- Obstacle spawning.
- Collectible spawning.

Deliverable: Gameplay prototype yang dapat dimainkan menggunakan keyboard.

## Phase 3 — Webcam & Motion Tracking

- Integrasi MediaPipe.
- Webcam permission.
- Pose detection.
- Body calibration.
- Gesture detection.
- Motion Controller.
- Menghubungkan gerakan tubuh ke karakter.

Deliverable: Gameplay menggunakan webcam.

## Phase 4 — Level Development

- Bamboo Forest.
- Distracted City.
- Ninja Temple.
- Level difficulty.
- Level progression.
- BK challenges.

Deliverable: Tiga level permainan.

## Phase 5 — UI/UX Implementation

- Main Menu.
- Tutorial.
- Camera Setup.
- HUD.
- Pause Menu.
- Result Screen.
- Reflection Panel.

Deliverable: UI lengkap sesuai referensi visual.

## Phase 6 — Testing & Optimization

- Motion tracking testing.
- Gameplay testing.
- UI testing.
- Collision testing.
- Browser compatibility.
- Performance optimization.
- Privacy testing.

Deliverable: Focus Ninja versi pertama siap didemonstrasikan.

---

# 16. ACCEPTANCE CRITERIA

Project dianggap memenuhi kebutuhan versi pertama apabila:

### Application

- Website dapat dibuka melalui browser desktop.
- Main menu dapat digunakan.
- Navigasi antarhalaman berfungsi.
- UI sesuai referensi visual.

### Webcam & Body Tracking

- Website dapat meminta izin webcam.
- MediaPipe dapat mendeteksi tubuh.
- Sistem dapat mendeteksi gerakan kiri dan kanan.
- Sistem dapat mendeteksi jongkok dan lompatan.
- Sistem kalibrasi berfungsi.
- Input gerakan tidak memicu aksi berulang secara tidak wajar.

### Gameplay

- Karakter dapat berlari otomatis.
- Karakter dapat berpindah tiga jalur.
- Karakter dapat melompat dan slide.
- Obstacle dapat muncul.
- Collectible dapat dikumpulkan.
- Collision detection berfungsi.
- Sistem skor berfungsi.
- Game over dan restart berfungsi.

### Educational Features

- Tiga level tersedia.
- Setiap level memiliki tujuan pembelajaran.
- Pertanyaan BK muncul sesuai level.
- Jawaban mendapatkan feedback.
- Result screen menampilkan evaluasi.
- Tips belajar ditampilkan setelah permainan.

### Performance & Privacy

- Game berjalan dengan performa yang layak.
- Video tidak dikirim ke server.
- Kamera berhenti ketika mode permainan ditutup.
- Game memiliki fallback keyboard untuk pengujian.

---

# 17. FUTURE DEVELOPMENT

Fitur yang dapat dipertimbangkan setelah versi pertama berhasil:

1. Personal Best Score.
2. Local Leaderboard.
3. Achievement System.
4. Character Skin.
5. Additional Levels.
6. Advanced Motion Calibration.
7. Teacher Dashboard.
8. Local Progress History.
9. Additional BK Learning Modules.

Pengembangan lanjutan tidak boleh mengganggu stabilitas fitur utama.

---

# 18. FINAL DEVELOPMENT INSTRUCTIONS FOR AI CODING AGENT

AI Coding Agent harus mengikuti seluruh spesifikasi dalam dokumen ini.

## Mandatory Rules

**1. Follow the PRD**

Jangan mengubah konsep utama Focus Ninja tanpa alasan teknis yang kuat.

**2. Follow Visual References**

Gunakan lima kategori asset design yang telah disediakan sebagai acuan:

- Character Design Reference.
- Environment Design Reference.
- Obstacle Design Reference.
- Collectible Design Reference.
- Game UI Design Reference.

**3. Prioritize Working Gameplay**

Utamakan gameplay yang benar-benar berfungsi sebelum menambahkan dekorasi visual yang kompleks.

**4. Modular Architecture**

Pisahkan sistem game, motion tracking, UI, dan level management.

**5. Real Full-Body Tracking**

Gunakan MediaPipe Pose Landmarker. Jangan mengganti sistem full-body tracking menjadi hand tracking saja.

**6. No VR Integration**

Project ini hanya menggunakan webcam melalui browser. Tidak membutuhkan VR headset atau WebXR.

**7. No Blender Dependency**

Blender tidak diwajibkan. Gunakan asset GLB/GLTF siap pakai atau geometry Three.js apabila model belum tersedia.

**8. Asset Consistency**

Jangan mencampurkan gaya visual realistis dengan gaya chibi low-poly yang sudah ditetapkan.

**9. Functional UI**

Semua tombol harus memiliki fungsi nyata. Hindari tombol dekoratif yang tidak bekerja.

**10. Incremental Development**

Bangun project secara bertahap. Jangan mengimplementasikan seluruh fitur sekaligus tanpa pengujian.

## Final Product Goal

Menghasilkan website game edukasi 3D bernama **Focus Ninja: Taklukkan Distraksi!** yang memiliki:

- Cute chibi ninja character.
- Third-person endless runner gameplay.
- Three-lane movement system.
- Webcam-based full-body tracking.
- Three unique game levels.
- Educational obstacle and collectible mechanics.
- Interactive BK challenges.
- Learning reflection and result system.
- Consistent UI/UX based on provided visual references.

**The final experience should feel like a polished, playful 3D endless runner game while maintaining its primary purpose as an interactive Guidance and Counseling educational medium.**

---

**END OF PRODUCT REQUIREMENTS DOCUMENT**

Document Version: 1.0  
Product: Focus Ninja  
Platform: Web-Based 3D Educational Game  
Development Status: Ready for Implementation Planning