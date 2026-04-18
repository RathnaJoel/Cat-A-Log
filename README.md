# 📖 Cat-A-Log!

A dynamic full-stack catalogue website that organizes collections of **Characters**, **Places**, and **Monuments** — built as a college practical project demonstrating core web development concepts.

---

## ✨ Features

- 🏠 **Homepage** — Category selector with animated cards (Characters, Places, Monuments)
- 📂 **Catalogue Pages** — Dynamic item listing loaded via AJAX from MySQL
- 📄 **Detail Pages** — Full item info with jQuery accordion / collapsible sections
- ⚙️ **Admin Panel** — Add, edit, and delete entries with live form validation
- 🔍 **Search & Filter** — Real-time AJAX search within each catalogue
- 📄 **Pagination** — Load items page by page
- 📱 **Responsive Design** — Works on mobile, tablet, and desktop
- 🎨 **Animations** — CSS transitions, hover effects, jQuery fadeIn / slideToggle

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| jQuery | Animations, AJAX calls, Accordion, DOM manipulation |
| Backend | PHP 8+ |
| Database | MySQL (via XAMPP / MariaDB) |
| Server | Apache (XAMPP) |
| Version Control | Git & GitHub |

---

## 📁 Project Structure
Cat-A-Log/
├── index.html              # Main SPA shell
├── admin.html              # Admin panel
├── catalogue_db.sql        # Database schema + sample data
├── config/
│   ├── db.php              # DB connection (git-ignored)
│   └── db.example.php      # Template — copy to db.php
├── api/
│   ├── get_items.php       # Fetch catalogue items (AJAX)
│   ├── get_detail.php      # Fetch single item detail (AJAX)
│   ├── add_item.php        # Add new entry (Admin)
│   ├── update_item.php     # Edit entry (Admin)
│   └── delete_item.php     # Delete entry (Admin)
├── css/
│   ├── style.css           # Main stylesheet
│   └── admin.css           # Admin panel styles
├── js/
│   ├── main.js             # Frontend logic, routing, AJAX
│   └── admin.js            # Admin CRUD logic
└── assets/
└── images/             # Character, place, monument images
├── characters/
├── places/
└── monuments/
