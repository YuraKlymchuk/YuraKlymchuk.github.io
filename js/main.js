function loadUserProfile() {
    const avatarImg = document.getElementById('profile-avatar-img');

    if (!avatarImg) {
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const userId = parseInt(urlParams.get('id'), 10) || 1;

    window.fetch('./api/users.json')
        .then((response) => response.json())
        .then((users) => {
            const user = users.find((u) => u.id === userId);

            if (!user) {
                document.getElementById('profile-username').textContent = 'User not found';
                return;
            }

            document.getElementById('profile-username').textContent = user.username;
            document.getElementById('profile-role').textContent = user.role;
            document.getElementById('profile-status').textContent = user.status;

            avatarImg.src = 'assets/profile-avatar.png';

            const dateObj = new Date(user.registeredDate);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            });
            document.getElementById('profile-registered').textContent = formattedDate;
        })
        .catch(() => {
            document.getElementById('profile-username').textContent = 'Error loading data';
        });
}

function loadEvents() {
    const eventsGrid = document.getElementById('events-grid-container');

    if (!eventsGrid) {
        return;
    }

    window.fetch('./api/events.json')
        .then((response) => response.json())
        .then((events) => {
            eventsGrid.innerHTML = '';

            events.forEach((event) => {
                const article = document.createElement('article');
                article.className = 'event-card';

                const dateObj = new Date(event.date);
                const formattedDate = dateObj.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                });

                let buttonsHtml = '';
                if (event.creator === 'yurii_admin') {
                    buttonsHtml = `
                        <a class="btn-secondary" href="event-form.html">Edit</a>
                        <button class="btn-danger" type="button">Delete</button>
                    `;
                } else {
                    buttonsHtml = `
                        <a class="btn-secondary" href="party-details.html">View details</a>
                    `;
                }

                article.innerHTML = `
                    <img class="event-image" src="${event.image}" alt="Event image for ${event.title}">
                    <div class="event-details">
                        <h3 class="event-title">${event.title}</h3>
                        <p class="event-date">${formattedDate}</p>
                        <p class="event-status">Status: ${event.status}</p>
                        <div class="card-actions">
                            ${buttonsHtml}
                        </div>
                    </div>
                `;

                eventsGrid.appendChild(article);
            });
        })
        .catch(() => {
            eventsGrid.innerHTML = '<p class="error-text">Failed to load events calendar.</p>';
        });
}

function loadUsers() {
    const usersContainer = document.getElementById('users-list-container');

    if (!usersContainer) {
        return;
    }

    window.fetch('./api/users.json')
        .then((response) => response.json())
        .then((users) => {
            usersContainer.innerHTML = '';

            users.forEach((user) => {
                const article = document.createElement('article');
                article.className = 'user-card';

                article.innerHTML = `
                    <h3 class="user-name">
                        <a href="user-info.html?id=${user.id}" style="text-decoration: none; color: inherit;">
                            ${user.username}
                        </a>
                    </h3>
                    <p class="user-role">Role: ${user.role}</p>
                    <button class="btn-secondary" type="button">Edit user</button>
                    <button class="btn-danger" type="button">Delete user</button>
                `;

                usersContainer.appendChild(article);
            });
        })
        .catch(() => {
            usersContainer.innerHTML = '<p class="error-text">Failed to load users list.</p>';
        });
}

loadUserProfile();
loadEvents();
loadUsers();
