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

├── index.html              
├── admin.html              
├── catalogue_db.sql       
├── config/
│   ├── db.php             
│   └── db.example.php     
├── api/
│   ├── get_items.php       
│   ├── get_detail.php     
│   ├── add_item.php        
│   ├── update_item.php     
│   └── delete_item.php     
├── css/
│   ├── style.css          
│   └── admin.css          
├── js/
│   ├── main.js             
│   └── admin.js         
└── assets/
└── images/             
├── characters/
├── places/
└── monuments/
