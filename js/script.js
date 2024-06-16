document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('addScheduleForm');
    const activityList = document.getElementById('activityList');
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    form.appendChild(errorMessage);

    // Daftar kegiatan untuk mencegah duplikasi
    const activities = new Map();

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Ambil nilai dari input
        const session = document.getElementById('session').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const activity = document.getElementById('activity').value.trim();
        const track = document.getElementById('track').value;
        const member = document.getElementById('member').value;

        // Hitung waktu satu jam berikutnya
        const startTime = new Date(`1970-01-01T${time}:00`);
        const endTime = new Date(startTime);
        endTime.setHours(startTime.getHours() + 1);

        // Format waktu dalam jam:menit
        const formattedTime = `${time} - ${endTime.toTimeString().slice(0, 5)}`;

        // Format tanggal
        const formattedDate = new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        // Ambil nama hari dari tanggal
        const dayOfWeek = new Date(date).toLocaleDateString('id-ID', { weekday: 'long' });

        let activityTable;
        if (activities.has(activity)) {
            // Ambil tabel yang sudah ada untuk kegiatan tersebut
            activityTable = activities.get(activity);
        } else {
            // Buat elemen baru untuk kegiatan dan tabelnya
            const activityContainer = document.createElement('div');
            activityContainer.classList.add('activity-container');

            const activityTitle = document.createElement('h3');
            activityTitle.textContent = activity;
            activityContainer.appendChild(activityTitle);

            activityTable = document.createElement('table');
            activityTable.classList.add('timetable');
            activityTable.innerHTML = `
                <thead>
                    <tr>
                        <th>Sesi</th>
                        <th>Waktu</th>
                        <th>Jalur</th>
                        <th>Member</th>
                        <th>Hari</th>
                        <th>Tanggal</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            activityContainer.appendChild(activityTable);
            activityList.appendChild(activityContainer);

            // Simpan referensi ke tabel kegiatan dalam peta
            activities.set(activity, activityTable);
        }

        // Ambil tbody dari tabel kegiatan yang sesuai
        const tableBody = activityTable.querySelector('tbody');

        // Periksa duplikasi berdasarkan waktu dan member
        let isDuplicate = false;
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const rowTime = row.cells[1].textContent;
            const rowMember = row.cells[3].textContent;
            if (rowTime === formattedTime && rowMember === member) {
                isDuplicate = true;
            }
        });

        if (isDuplicate) {
            errorMessage.textContent = 'Error: Waktu dan member yang sama sudah ada dalam tabel.';
            errorMessage.style.color = 'red';
        } else {
            errorMessage.textContent = '';

            // Tambahkan baris baru ke tabel kegiatan
            const newRow = document.createElement('tr');
            
            // Buat sel untuk setiap kolom
            const sessionCell = document.createElement('td');
            sessionCell.textContent = session;
            newRow.appendChild(sessionCell);

            const timeCell = document.createElement('td');
            timeCell.textContent = formattedTime;
            newRow.appendChild(timeCell);

            const trackCell = document.createElement('td');
            trackCell.textContent = track;
            newRow.appendChild(trackCell);

            const memberCell = document.createElement('td');
            memberCell.textContent = member;
            newRow.appendChild(memberCell);

            const dayCell = document.createElement('td');
            dayCell.textContent = dayOfWeek;
            newRow.appendChild(dayCell);

            const dateCell = document.createElement('td');
            dateCell.textContent = formattedDate;
            newRow.appendChild(dateCell);

            // Tambahkan baris baru ke tabel kegiatan
            tableBody.appendChild(newRow);

            // Reset form setelah menambah data
            form.reset();
        }
    });
});
