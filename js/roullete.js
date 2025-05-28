document.addEventListener('DOMContentLoaded', () => {
    const totalPeopleInput = document.getElementById('totalPeople');
    const startGameBtn = document.getElementById('startGameBtn');
    const gameArea = document.getElementById('gameArea');
    const probabilityDisplay = document.getElementById('probabilityDisplay');
    const drawOneBtn = document.getElementById('drawOneBtn');
    const drawAllBtn = document.getElementById('drawAllBtn');
    const removeNumberBtn = document.getElementById('removeNumberBtn');
    const ticketsLeftSpan = document.getElementById('ticketsLeft');
    const drawnNumbersList = document.getElementById('drawnNumbersList');
    const searchNumberInput = document.getElementById('searchNumber');
    const searchBtn = document.getElementById('searchBtn');
    const searchResultParagraph = document.getElementById('searchResult');

    const totalTickets = 48;
    const maxPeople = 350;

    let totalPeople = 0;
    let allCandidates = [];
    let remainingCandidates = [];
    let drawnNumbers = [];
    let ticketsLeft = totalTickets;
    let lastDrawn = null; // Menyimpan nomor terakhir yang diundi

    // --- Fungsi Utilitas ---
    function updateDisplay() {
        ticketsLeftSpan.textContent = ticketsLeft;

        // Kosongkan dan isi ulang daftar nomor yang diundi
        drawnNumbersList.innerHTML = '';
        if (drawnNumbers.length === 0) {
            const noNumbers = document.createElement('p');
            noNumbers.classList.add('no-numbers');
            noNumbers.textContent = 'Belum ada nomor yang diundi.';
            drawnNumbersList.appendChild(noNumbers);
        } else {
            drawnNumbers.forEach(num => {
                const numItem = document.createElement('span');
                numItem.classList.add('drawn-number-item');
                numItem.textContent = num;
                drawnNumbersList.appendChild(numItem);
            });
            // Auto-scroll ke bawah saat ada nomor baru
            drawnNumbersList.scrollTop = drawnNumbersList.scrollHeight;
        }

        // Disable tombol jika tiket habis atau tidak ada kandidat
        if (ticketsLeft <= 0 || remainingCandidates.length === 0) {
            drawOneBtn.disabled = true;
            drawAllBtn.disabled = true;
            drawOneBtn.style.opacity = '0.7';
            drawAllBtn.style.opacity = '0.7';
        } else {
            drawOneBtn.disabled = false;
            drawAllBtn.disabled = false;
            drawOneBtn.style.opacity = '1';
            drawAllBtn.style.opacity = '1';
        }
        // Disable tombol hapus jika tidak ada nomor yang diundi
        if (drawnNumbers.length === 0) {
            removeNumberBtn.disabled = true;
            removeNumberBtn.style.opacity = '0.7';
        } else {
            removeNumberBtn.disabled = false;
            removeNumberBtn.style.opacity = '1';
        }
    }

    function calculateProbability() {
        if (totalPeople > 0) {
            const probability = (totalTickets / totalPeople) * 100;
            probabilityDisplay.textContent = `💡 Peluang Anda mendapatkan tiket adalah: ${probability.toFixed(2)}%`;
        } else {
            probabilityDisplay.textContent = ``;
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Tukar elemen
        }
    }

    function displayMessage(element, message, type = 'info') {
        element.textContent = message;
        element.style.color = ''; // Reset color
        if (type === 'error') {
            element.style.color = '#f44336'; // Red
        } else if (type === 'success') {
            element.style.color = '#4CAF50'; // Green
        } else if (type === 'warning') {
            element.style.color = '#FFC107'; // Amber
        }
    }

    // --- Event Listeners ---

    startGameBtn.addEventListener('click', () => {
        const inputVal = parseInt(totalPeopleInput.value);

        if (isNaN(inputVal) || inputVal < totalTickets || inputVal > maxPeople) {
            alert(`⚠️ Jumlah orang harus antara ${totalTickets} dan ${maxPeople}.`);
            return;
        }

        totalPeople = inputVal;
        allCandidates = Array.from({ length: totalPeople }, (_, i) => i + 1);
        shuffleArray(allCandidates);
        remainingCandidates = [...allCandidates]; // Salin untuk undian
        drawnNumbers = [];
        ticketsLeft = totalTickets;
        lastDrawn = null;

        calculateProbability();
        gameArea.classList.remove('hidden');
        updateDisplay();
        displayMessage(searchResultParagraph, ''); // Clear search result
    });

    drawOneBtn.addEventListener('click', () => {
        if (ticketsLeft > 0 && remainingCandidates.length > 0) {
            lastDrawn = remainingCandidates.shift(); // Ambil nomor pertama dari array yang sudah diacak
            drawnNumbers.push(lastDrawn);
            ticketsLeft--;
            displayMessage(searchResultParagraph, `🎉 Nomor yang mendapatkan tiket: ${lastDrawn}`, 'success');
            updateDisplay();
        } else {
            displayMessage(searchResultParagraph, '✅ Semua tiket telah diundi atau tidak ada kandidat tersisa.', 'info');
        }
    });

    drawAllBtn.addEventListener('click', async () => {
        if (ticketsLeft > 0 && remainingCandidates.length > 0) {
            displayMessage(searchResultParagraph, '🚀 Memulai pengundian otomatis...', 'info');
            drawOneBtn.disabled = true; // Disable tombol saat otomatis
            drawAllBtn.disabled = true;

            while (ticketsLeft > 0 && remainingCandidates.length > 0) {
                lastDrawn = remainingCandidates.shift();
                drawnNumbers.push(lastDrawn);
                ticketsLeft--;
                updateDisplay();
                await new Promise(resolve => setTimeout(resolve, 100)); // Jeda 100ms
            }
            displayMessage(searchResultParagraph, '✅ Semua tiket telah diundi.', 'success');
            drawOneBtn.disabled = false; // Enable kembali
            drawAllBtn.disabled = false;
        } else {
            displayMessage(searchResultParagraph, '✅ Semua tiket sudah diundi atau tidak ada kandidat tersisa untuk diundi otomatis.', 'info');
        }
    });

    removeNumberBtn.addEventListener('click', () => {
        if (drawnNumbers.length === 0) {
            displayMessage(searchResultParagraph, "⚠️ Belum ada nomor yang diundi untuk dihapus.", 'warning');
            return;
        }

        // Logika baru: Jika jumlah drawn_numbers < 12, hanya bisa hapus yang terakhir diundi
        if (drawnNumbers.length < 12) {
            if (lastDrawn !== null && drawnNumbers.includes(lastDrawn)) { // Memastikan lastDrawn masih ada di daftar
                const removedIndex = drawnNumbers.indexOf(lastDrawn);
                drawnNumbers.splice(removedIndex, 1); // Hapus lastDrawn dari array
                ticketsLeft++;
                displayMessage(searchResultParagraph, `❌ Nomor ${lastDrawn} (terakhir diundi) telah dihapus dan tiket dikembalikan.`, 'error');

                // Update lastDrawn setelah penghapusan
                if (drawnNumbers.length > 0) {
                    lastDrawn = drawnNumbers[drawnNumbers.length - 1];
                } else {
                    lastDrawn = null;
                }
            } else {
                displayMessage(searchResultParagraph, "⚠️ Tidak ada nomor terakhir yang bisa dihapus.", 'warning');
            }
        } else {
            // Jika 12 atau lebih, minta pengguna memilih nomor
            let numToRemove = prompt("Masukkan nomor yang ingin dihapus dari daftar yang sudah diundi (Lihat di atas):");
            numToRemove = parseInt(numToRemove);

            if (isNaN(numToRemove) || numToRemove <= 0 || numToRemove > totalPeople) {
                displayMessage(searchResultParagraph, "⚠️ Masukkan angka yang valid dalam rentang peserta.", 'warning');
                return;
            }

            const indexToRemove = drawnNumbers.indexOf(numToRemove);
            if (indexToRemove !== -1) {
                drawnNumbers.splice(indexToRemove, 1); // Hapus nomor dari array
                ticketsLeft++;
                displayMessage(searchResultParagraph, `❌ Nomor ${numToRemove} telah dihapus dan tiket dikembalikan.`, 'error');

                // Update lastDrawn jika nomor yang dihapus adalah lastDrawn
                if (lastDrawn === numToRemove) {
                    if (drawnNumbers.length > 0) {
                        lastDrawn = drawnNumbers[drawnNumbers.length - 1];
                    } else {
                        lastDrawn = null;
                    }
                }
            } else {
                displayMessage(searchResultParagraph, `⚠️ Nomor ${numToRemove} tidak ada dalam daftar nomor yang sudah diundi.`, 'warning');
            }
        }
        updateDisplay();
    });

    searchBtn.addEventListener('click', () => {
        const searchNum = parseInt(searchNumberInput.value);

        if (isNaN(searchNum) || searchNum <= 0 || searchNum > totalPeople) {
            displayMessage(searchResultParagraph, `⚠️ Masukkan nomor yang valid antara 1 dan ${totalPeople}.`, 'warning');
            // Remove highlight if input is invalid
            document.querySelectorAll('.drawn-number-item').forEach(item => {
                item.classList.remove('highlight');
            });
            return;
        }

        // Remove previous highlights
        document.querySelectorAll('.drawn-number-item').forEach(item => {
            item.classList.remove('highlight');
        });

        if (drawnNumbers.includes(searchNum)) {
            const index = drawnNumbers.indexOf(searchNum);
            displayMessage(searchResultParagraph, `✅ Nomor ${searchNum} sudah keluar dan mendapatkan tiket. Ini adalah nomor ke-${index + 1} yang diundi.`, 'success');

            // Highlight the searched number
            const drawnItems = drawnNumbersList.querySelectorAll('.drawn-number-item');
            drawnItems.forEach(item => {
                if (parseInt(item.textContent) === searchNum) {
                    item.classList.add('highlight');
                    item.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Scroll to the highlighted item
                }
            });

        } else if (remainingCandidates.includes(searchNum)) {
            displayMessage(searchResultParagraph, `⏳ Nomor ${searchNum} masih dalam daftar undian dan belum keluar.`, 'info');
        } else {
            displayMessage(searchResultParagraph, `❓ Status nomor ${searchNum} tidak diketahui (mungkin sudah diundi tapi dihapus, atau tidak pernah masuk daftar).`, 'warning');
        }
    });

    // Inisialisasi tampilan awal
    updateDisplay();
    calculateProbability();
});