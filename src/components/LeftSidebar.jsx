import React, { useState } from 'react';

const LeftSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    { name: "Computers & Accessories", icon: "/src/assets/imgs/template/monitor.svg", subcategories: ["Computer Accessories", "Computer Cases", "Laptop", "HDD", "RAM", "Headphone"] },
    { name: "Cell Phones", icon: "/src/assets/imgs/template/mobile.svg", subcategories: ["Phone Accessories", "Phone Cases", "Postpaid Phones", "Unlocked Phones", "Prepaid Phones", "Prepaid Plans", "Refurbished Phones", "Straight Talk", "iPhone", "Samsung Galaxy"] },
    { name: "Gaming Gatgets", icon: "/src/assets/imgs/template/game.svg", subcategories: ["Wireless Routers", "Cool New Gadgets", "Tech and Gadgets", "Geek Gifts and Gadgets", "Xbox Accessories", "PlayStation Accessories"] },
    { name: "Smart watches", icon: "/src/assets/imgs/template/clock.svg", subcategories: ["Smart Watches", "Fashion Smart Watches", "Smart Bracelets", "Pocket Watches", "Smart Rings", "Other Watches"] },
    { name: "Wired Headphone", icon: "/src/assets/imgs/template/airpods.svg", subcategories: ["On-Ear Headphones", "Earbud & In-Ear", "DJ Headphones", "PC Accessories", "PC Game Headsets"] },
    { name: "Mouse & Keyboard", icon: "/src/assets/imgs/template/mouse.svg", subcategories: ["Logitech", "Redragon", "Amazon Basics", "Microsoft", "MageGee"] },
    { name: "Headphone", icon: "/src/assets/imgs/template/music-play.svg", subcategories: ["Car Audio Systems", "Cellphones", "Desktops", "Gaming Consoles", "Telephones"] },
    { name: "Bluetooth devices", icon: "/src/assets/imgs/template/bluetooth.svg", subcategories: ["Player Accessories", "Computer Accessories", "Speakers & Audio", "Computer Networking", "Movies & Films"] },
    { name: "Cloud Software", icon: "/src/assets/imgs/template/clound.svg", subcategories: ["Android", "Linux & Unix", "Macintosh", "Windows", "iPhone & iOS"] },
    { name: "Electric accessories", icon: "/src/assets/imgs/template/electricity.svg", subcategories: ["Antenna Toppers", "Automotive Body Armor", "Power Inverter", "Gas Tank Doors", "Hood Scoops & Vents"] },
    { name: "Mainboard & CPU", icon: "/src/assets/imgs/template/cpu.svg", subcategories: ["Computer CPU Processors", "Internal Fans & Cooling", "Graphics Cards", "Network I/O Port Cards", "Internal Memory Card"] },
    { name: "Desktop PC", icon: "/src/assets/imgs/template/devices.svg", subcategories: ["Graphic PC", "Office PC", "Gaming PC", "Server"] },
    { name: "Speaker", icon: "/src/assets/imgs/template/driver.svg", subcategories: ["JBL", "Anker", "Pyle", "Bose", "Logitech"] },
    { name: "Bluetooth Headphone", icon: "/src/assets/imgs/template/airpod.svg", subcategories: ["On-Ear Headphones", "In-Ear Headphones", "Earbud", "Over-Ear Headphones", "Other"] },
    { name: "Computer Decor", icon: "/src/assets/imgs/template/lamp.svg", subcategories: ["Copyholders", "Office Bookends", "Business Card Holders", "Lap Desks", "Mouse Pads"] }
  ];

  return (
    <>
      <div className="sidebar-left">
        <a className="btn btn-open" href="#" onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}></a>
        
        {/* Icon Menu */}
        <ul className="menu-icons hidden">
          {categories.slice(0, 15).map((category, index) => (
            <li key={index}>
              <a href="javascript:void(0)">
                <img src={category.icon} alt="Ecom" />
              </a>
            </li>
          ))}
        </ul>

        {/* Text Menu */}
        <ul className={`menu-texts ${isOpen ? 'menu-open' : 'menu-close'}`}>
          {categories.map((category, index) => (
            <li key={index} className="has-children">
              <a href="/shop">
                <span className="img-link">
                  <img src={category.icon} alt="Ecom" />
                </span>
                <span className="text-link">{category.name}</span>
              </a>
              <ul className="sub-menu">
                {category.subcategories.map((subcategory, subIndex) => (
                  <li key={subIndex}>
                    <a href="/shop">{subcategory}</a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default LeftSidebar;
