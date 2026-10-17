/**
 * PPR LIQUOR - Official Data Store & Persistence Layer
 * 1601 Paris Pike, Georgetown, Kentucky 40324
 * Phone: (502) 370-4392 | Email: pprliquor@gmail.com
 */

const STORAGE_KEYS = {
  PRODUCTS: 'ppr_products_data_v1',
  SPECIALS: 'ppr_specials_data_v1',
  STORE_INFO: 'ppr_store_info_v1',
  INQUIRIES: 'ppr_inquiries_data_v1',
  AGE_VERIFIED: 'ppr_age_verified_v1',
  ADMIN_AUTH: 'ppr_admin_session_v1',
  ADMIN_PIN: 'ppr_admin_pin_v1'
};

// Initial Default Store Info
const DEFAULT_STORE_INFO = {
  name: "PPR LIQUOR",
  tagline: "Your Neighborhood Destination for Bourbon, Whiskey, Wine, Beer & Spirits",
  address: "1601 Paris Pike",
  city: "Georgetown",
  state: "Kentucky",
  zip: "40324",
  fullAddress: "1601 Paris Pike, Georgetown, Kentucky 40324",
  phone: "(502) 370-4392",
  phoneRaw: "+15023704392",
  email: "pprliquor@gmail.com",
  mapsUrl: "https://maps.google.com/?q=1601+Paris+Pike,+Georgetown,+KY+40324",
  announcement: "🥃 Welcome to Georgetown's premier bourbon destination! Inquire at (502) 370-4392 for allocated releases & daily specials.",
  hours: {
    sunday: { label: "Sunday", open: "10:00 AM", close: "10:00 PM", openHour: 10, closeHour: 22 },
    monday: { label: "Monday", open: "9:00 AM", close: "11:00 PM", openHour: 9, closeHour: 23 },
    tuesday: { label: "Tuesday", open: "9:00 AM", close: "11:00 PM", openHour: 9, closeHour: 23 },
    wednesday: { label: "Wednesday", open: "9:00 AM", close: "11:00 PM", openHour: 9, closeHour: 23 },
    thursday: { label: "Thursday", open: "9:00 AM", close: "12:00 AM", openHour: 9, closeHour: 24 },
    friday: { label: "Friday", open: "9:00 AM", close: "12:00 AM", openHour: 9, closeHour: 24 },
    saturday: { label: "Saturday", open: "9:00 AM", close: "12:00 AM", openHour: 9, closeHour: 24 }
  },
  legalDisclaimer: "PPR LIQUOR is a licensed retail alcohol beverage dealer in Georgetown, Kentucky. You must be at least 21 years of age to purchase alcohol. Please drink responsibly. This website is an informational browse-only catalog with no online ordering or checkout."
};

// Initial Products Data with Authentic Kentucky Bourbons and Curated Spirits
const DEFAULT_PRODUCTS = [
  {
    id: "prod-bt-01",
    name: "Buffalo Trace Kentucky Straight Bourbon",
    brand: "Buffalo Trace",
    category: "Kentucky Bourbon",
    size: "750ml",
    proof: "90 Proof (45% ABV)",
    price: "$29.99",
    status: "In Stock",
    featured: true,
    image: "assets/images/bourbon-bottle.jpg",
    description: "Ancient Buffalo carved paths through the wilderness that led American pioneers to the banks of the Kentucky River. Crafted at America's oldest continuously operating distillery, Buffalo Trace is deep amber with aroma of vanilla, mint, and molasses. Pleasantly sweet to the taste with notes of brown sugar and spice that give way to oak, toffee, dark fruit and anise.",
    tastingNotes: ["Vanilla & Mint", "Molasses & Toffee", "Sweet Oak Finish"]
  },
  {
    id: "prod-wr-02",
    name: "Woodford Reserve Distiller's Select",
    brand: "Woodford Reserve",
    category: "Kentucky Bourbon",
    size: "750ml",
    proof: "90.4 Proof (45.2% ABV)",
    price: "$36.99",
    status: "In Stock",
    featured: true,
    image: "assets/images/bourbon-bottle.jpg",
    description: "The art of making fine bourbon first took place on the historic site of the Woodford Reserve Distillery in 1812. Perfectly balanced with more than 200 detectable flavor notes, from bold grain and wood, to sweet aromatics, fruit, and floral notes.",
    tastingNotes: ["Rich Dried Fruit", "Dark Chocolate & Cocoa", "Warm Cinnamon Spice"]
  },
  {
    id: "prod-mm-03",
    name: "Maker's Mark Kentucky Straight Bourbon",
    brand: "Maker's Mark",
    category: "Kentucky Bourbon",
    size: "750ml",
    proof: "90 Proof (45% ABV)",
    price: "$28.99",
    status: "In Stock",
    featured: true,
    image: "assets/images/bourbon-bottle.jpg",
    description: "Made with soft red winter wheat instead of the usual rye for a one-of-a-kind, full-flavored bourbon that's easy to sip. Every single bottle is hand-dipped in signature red wax at Star Hill Farm in Loretto, Kentucky.",
    tastingNotes: ["Caramel & Butterscotch", "Spiced Honey", "Smooth Creamy Oak"]
  },
  {
    id: "prod-bl-04",
    name: "Blanton's The Original Single Barrel Bourbon",
    brand: "Blanton's",
    category: "Kentucky Bourbon",
    size: "750ml",
    proof: "93 Proof (46.5% ABV)",
    price: "Call for Pricing",
    status: "Limited Allocation",
    featured: true,
    image: "assets/images/bourbon-bottle.jpg",
    description: "The world's first single barrel bourbon whiskey, aged in famous Warehouse H. Highly sought after by collectors worldwide, topped with the famous collectible horse and jockey stopper.",
    tastingNotes: ["Sweet Citrus Peel", "Nutmeg & Cinnamon", "Creamy Vanilla & Burnt Sugar"]
  },
  {
    id: "prod-er-05",
    name: "Eagle Rare 10 Year Kentucky Straight Bourbon",
    brand: "Eagle Rare",
    category: "Kentucky Bourbon",
    size: "750ml",
    proof: "90 Proof (45% ABV)",
    price: "Call for Pricing",
    status: "Limited Allocation",
    featured: true,
    image: "assets/images/bourbon-bottle.jpg",
    description: "Aged no less than ten years, Eagle Rare lives up to its name with its lofty, distinctive taste experience. The nose is complex, with aromas of toffee, hints of orange peel, herbs, honey, leather and oak.",
    tastingNotes: ["Candied Almonds", "Rich Cocoa & Leather", "Long Dry Oak Finish"]
  },
  {
    id: "prod-weller-06",
    name: "W.L. Weller Special Reserve",
    brand: "W.L. Weller",
    category: "Kentucky Bourbon",
    size: "750ml",
    proof: "90 Proof (45% ABV)",
    price: "Call for Pricing",
    status: "Limited Allocation",
    featured: true,
    image: "assets/images/bourbon-bottle.jpg",
    description: "The original wheated bourbon whiskey features an exceptionally smooth taste, substituting wheat for rye grain. Bottled at 90 proof, this bourbon stands out with its burnt orange color and soft, honeyed floral aromas.",
    tastingNotes: ["Burnt Orange", "Caramel & Honey", "Soft Floral Wheat"]
  },
  {
    id: "prod-kc-07",
    name: "Knob Creek 9 Year Kentucky Straight Bourbon",
    brand: "Knob Creek",
    category: "Kentucky Bourbon",
    size: "750ml",
    proof: "100 Proof (50% ABV)",
    price: "$34.99",
    status: "In Stock",
    featured: false,
    image: "assets/images/bourbon-bottle.jpg",
    description: "Bottled at an honest 100 proof and aged nine years in deeply charred American oak, Knob Creek embodies pre-prohibition bourbon style with bold sweetness and robust oak.",
    tastingNotes: ["Rich Maple Syrup", "Toasted Pecans", "Heavy Charred Oak"]
  },
  {
    id: "prod-ec-08",
    name: "Elijah Craig Small Batch Kentucky Bourbon",
    brand: "Elijah Craig",
    category: "Kentucky Bourbon",
    size: "750ml",
    proof: "94 Proof (47% ABV)",
    price: "$31.99",
    status: "In Stock",
    featured: false,
    image: "assets/images/bourbon-bottle.jpg",
    description: "Named after the Baptist minister credited with discovering the charred oak aging method. Elijah Craig Small Batch is a warm, woody bourbon packed with smoke, nutmeg, and spiced vanilla.",
    tastingNotes: ["Vanilla Bean", "Subtle Smoke & Spice", "Nutmeg & Toasted Marshmallow"]
  },
  {
    id: "prod-wt-09",
    name: "Wild Turkey 101 Kentucky Straight Bourbon",
    brand: "Wild Turkey",
    category: "Kentucky Bourbon",
    size: "1.75L",
    proof: "101 Proof (50.5% ABV)",
    price: "$44.99",
    status: "In Stock",
    featured: false,
    image: "assets/images/bourbon-bottle.jpg",
    description: "For over 60 years, Master Distiller Jimmy Russell has crafted Wild Turkey 101 the right way. High rye mashbill with exceptional depth, bold character, and warm spice.",
    tastingNotes: ["Bold Rye Spice", "Vanilla Custard", "Cigar Leaf & Caramel"]
  },
  {
    id: "prod-fr-10",
    name: "Four Roses Single Barrel Bourbon",
    brand: "Four Roses",
    category: "Four Roses",
    category: "Kentucky Bourbon",
    size: "750ml",
    proof: "100 Proof (50% ABV)",
    price: "$46.99",
    status: "In Stock",
    featured: false,
    image: "assets/images/bourbon-bottle.jpg",
    description: "A premium, single barrel bourbon with distinctive floral and spicy flavors. Made in Lawrenceburg, Kentucky using Four Roses proprietary yeast strains and vintage recipe OBSV.",
    tastingNotes: ["Ripe Ripe Plums", "Cocoa & Maple", "Rich Woody Spices"]
  },
  // Tequila
  {
    id: "prod-teq-01",
    name: "Don Julio 1942 Añejo Tequila",
    brand: "Don Julio",
    category: "Tequila",
    size: "750ml",
    proof: "80 Proof (40% ABV)",
    price: "Call for Pricing",
    status: "Limited Allocation",
    featured: true,
    image: "assets/images/tequila-bottle.jpg",
    description: "Celebrated in exclusive cocktail bars and restaurants worldwide. Produced in small batches and aged for a minimum of two and a half years in American white oak barrels.",
    tastingNotes: ["Roasted Agave", "Warm Oak & Vanilla", "Toffee & Sun-Dried Fruit"]
  },
  {
    id: "prod-teq-02",
    name: "Casamigos Reposado Tequila",
    brand: "Casamigos",
    category: "Tequila",
    size: "750ml",
    proof: "80 Proof (40% ABV)",
    price: "$54.99",
    status: "In Stock",
    featured: false,
    image: "assets/images/tequila-bottle.jpg",
    description: "Aged for 7 months in premium American white oak barrels. Soft, slightly oaky with hints of caramel and cocoa. Silky smooth texture with a medium to long finish.",
    tastingNotes: ["Golden Caramel", "Cocoa Bean", "Sweet Roasted Agave"]
  },
  {
    id: "prod-teq-03",
    name: "Patrón Silver Tequila",
    brand: "Patrón",
    category: "Tequila",
    size: "750ml",
    proof: "80 Proof (40% ABV)",
    price: "$48.99",
    status: "In Stock",
    featured: false,
    image: "assets/images/tequila-bottle.jpg",
    description: "Handcrafted from the finest 100% Weber Blue Agave and carefully distilled in small batches at Hacienda Patrón in Jalisco, Mexico. Crystal clear with fruit and citrus notes.",
    tastingNotes: ["Fresh Agave", "Bright Citrus", "Crisp Clean Pepper"]
  },
  // Whiskey & Scotch
  {
    id: "prod-sc-01",
    name: "The Macallan 12 Year Double Cask",
    brand: "The Macallan",
    category: "Whiskey & Scotch",
    size: "750ml",
    proof: "86 Proof (43% ABV)",
    price: "$79.99",
    status: "In Stock",
    featured: true,
    image: "assets/images/bourbon-bottle.jpg",
    description: "Matured in a combination of American and European oak sherry seasoned casks. Delivers a harmonious union of rich fruit, sherry sweetness, and delicate wood spice.",
    tastingNotes: ["Butterscotch Candy", "Candied Orange Peel", "Warm Ginger & Cinnamon"]
  },
  {
    id: "prod-wh-02",
    name: "Jameson Irish Whiskey",
    brand: "Jameson",
    category: "Whiskey & Scotch",
    size: "1.75L",
    proof: "80 Proof (40% ABV)",
    price: "$49.99",
    status: "In Stock",
    featured: false,
    image: "assets/images/bourbon-bottle.jpg",
    description: "Triple distilled and aged for a minimum of 4 years in oak casks, Jameson is world-renowned for its signature smoothness and balance of spicy, nutty, and vanilla notes.",
    tastingNotes: ["Triple-Distilled Smoothness", "Toasted Wood", "Sherry Undertones"]
  },
  // Vodka
  {
    id: "prod-vod-01",
    name: "Tito's Handmade Vodka",
    brand: "Tito's",
    category: "Vodka",
    size: "1.75L",
    proof: "80 Proof (40% ABV)",
    price: "$32.99",
    status: "In Stock",
    featured: true,
    image: "assets/images/tequila-bottle.jpg",
    description: "Crafted in small batches in Austin, Texas using traditional old-fashioned pot stills. Naturally gluten-free, batch-distilled from yellow corn for an exceptionally clean sip.",
    tastingNotes: ["Ultra Clean Profile", "Subtle Sweet Corn", "Crisp Smooth Finish"]
  },
  {
    id: "prod-vod-02",
    name: "Grey Goose French Vodka",
    brand: "Grey Goose",
    category: "Vodka",
    size: "750ml",
    proof: "80 Proof (40% ABV)",
    price: "$34.99",
    status: "In Stock",
    featured: false,
    image: "assets/images/tequila-bottle.jpg",
    description: "Distilled in Picardy, France using soft winter wheat and spring water filtered through champagne limestone from Gensac-la-Pallue.",
    tastingNotes: ["Delicate Floral", "Subtle Citrus Peel", "Velvety Mouthfeel"]
  },
  // Wine & Champagne
  {
    id: "prod-wine-01",
    name: "Caymus Vineyards Napa Valley Cabernet Sauvignon",
    brand: "Caymus",
    category: "Wine",
    size: "750ml",
    proof: "14.6% ABV",
    price: "$89.99",
    status: "In Stock",
    featured: true,
    image: "assets/images/wine-bottle.jpg",
    description: "Signature Napa Valley Cabernet Sauvignon known for dark color, rich velvety fruit, supple tannins and lingering finish. Perfect pairing for prime steaks and celebration dinners.",
    tastingNotes: ["Ripe Blackberry", "Cassis & Dark Cherry", "Velvety French Oak"]
  },
  {
    id: "prod-wine-02",
    name: "Veuve Clicquot Yellow Label Brut Champagne",
    brand: "Veuve Clicquot",
    category: "Champagne/Sparkling",
    size: "750ml",
    proof: "12% ABV",
    price: "$69.99",
    status: "In Stock",
    featured: true,
    image: "assets/images/wine-bottle.jpg",
    description: "The iconic Yellow Label balances strength and silkiness. Dominated by Pinot Noir for structure, Chardonnay for elegance, and Meunier for roundness.",
    tastingNotes: ["Crisp Yellow Apple", "Toasted Brioche & Vanilla", "Lively Mineral Bubbles"]
  },
  {
    id: "prod-wine-03",
    name: "Meiomi California Pinot Noir",
    brand: "Meiomi",
    category: "Wine",
    size: "750ml",
    proof: "13.7% ABV",
    price: "$19.99",
    status: "In Stock",
    featured: false,
    image: "assets/images/wine-bottle.jpg",
    description: "A rich, jammy Pinot Noir sourced from California's premiere coastal regions (Sonoma, Monterey, and Santa Barbara). Lush and approachable.",
    tastingNotes: ["Boysenberry & Strawberry", "Toasted Mocha", "Silky Vanilla Oak"]
  },
  // Beer & Local Craft
  {
    id: "prod-beer-01",
    name: "Kentucky Bourbon Barrel Ale",
    brand: "Lexington Brewing Co.",
    category: "Beer",
    size: "6-Pack Bottles",
    proof: "8.2% ABV",
    price: "$14.99",
    status: "In Stock",
    featured: true,
    image: "assets/images/bourbon-bottle.jpg",
    description: "Award-winning ale aged up to six weeks in freshly decanted bourbon barrels from local Kentucky distilleries. Subtle yet distinct vanilla and oak flavors.",
    tastingNotes: ["Bourbon Barrel Oak", "Vanilla & Caramel", "Smooth Warming Malt"]
  },
  {
    id: "prod-beer-02",
    name: "High Noon Sun Sips Variety Pack",
    brand: "High Noon",
    category: "Ready-to-Drink/Cocktails",
    size: "8-Pack Cans",
    proof: "4.5% ABV",
    price: "$19.99",
    status: "In Stock",
    featured: false,
    image: "assets/images/tequila-bottle.jpg",
    description: "Made with real vodka, real sparkling juice, and sparkling water. Low calorie, gluten-free, and no added sugar.",
    tastingNotes: ["Real Black Cherry", "Fresh Pineapple", "Grapefruit & Peach"]
  }
];

// Initial Specials & Promotions
const DEFAULT_SPECIALS = [
  {
    id: "spec-01",
    title: "Kentucky Bourbon Spotlight: Buffalo Trace 750ml",
    subtitle: "Georgetown's Favorite Pour",
    product: "Buffalo Trace Kentucky Straight Bourbon",
    badge: "Bourbon Spotlight",
    dealText: "Special Neighborhood Pricing: $29.99",
    terms: "While daily supplies last. Limit 1 bottle per customer on allocated batches.",
    startDate: "2026-10-01",
    endDate: "2026-11-30",
    category: "Kentucky Bourbon",
    active: true
  },
  {
    id: "spec-02",
    title: "Woodford Reserve Weekend Showcase",
    subtitle: "Distiller's Select 750ml & 1.75L",
    product: "Woodford Reserve Distiller's Select",
    badge: "Weekend Special",
    dealText: "$36.99 (750ml) | Ask About Handle Pricing",
    terms: "In-store walk-in special. Subject to verified stock.",
    startDate: "2026-10-15",
    endDate: "2026-10-31",
    category: "Kentucky Bourbon",
    active: true
  },
  {
    id: "spec-03",
    title: "Caymus Napa Valley Cabernet Celebration",
    subtitle: "Top Shelf Wine Feature",
    product: "Caymus Vineyards Napa Valley Cabernet Sauvignon",
    badge: "Cellar Pick",
    dealText: "Special Store Feature: $89.99",
    terms: "Valid on in-stock vintage bottles. Must be 21+ with valid ID.",
    startDate: "2026-10-10",
    endDate: "2026-11-15",
    category: "Wine",
    active: true
  },
  {
    id: "spec-04",
    title: "Kentucky Bourbon Barrel Ale 6-Packs",
    subtitle: "Local Bluegrass Pride",
    product: "Kentucky Bourbon Barrel Ale",
    badge: "Local Craft",
    dealText: "Cold 6-Pack: $14.99",
    terms: "Grab it chilled from our walk-in beer cave.",
    startDate: "2026-10-01",
    endDate: "2026-12-31",
    category: "Beer",
    active: true
  }
];

// Initial Demo Inquiries (so admin sees realistic incoming messages)
const DEFAULT_INQUIRIES = [
  {
    id: "inq-01",
    date: "2026-10-16 14:22",
    name: "James Henderson",
    phone: "(502) 555-0194",
    email: "j.henderson84@gmail.com",
    subject: "Allocated Bourbon Availability",
    message: "Hi PPR team, do you have any Blanton's or Eagle Rare coming in on your delivery this Thursday? Would love to stop by right after work. Thanks!",
    status: "New"
  },
  {
    id: "inq-02",
    date: "2026-10-15 11:05",
    name: "Sarah Miller",
    phone: "(859) 555-8321",
    email: "smiller_design@yahoo.com",
    subject: "Wedding Champagne Order",
    message: "Planning a reception next month in Georgetown. Looking for 3 cases of Veuve Clicquot or similar dry champagne. Can we set up a special order hold?",
    status: "Responded"
  }
];

// Database Management Class
class PPRDatabase {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      this.saveProducts(DEFAULT_PRODUCTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SPECIALS)) {
      this.saveSpecials(DEFAULT_SPECIALS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.STORE_INFO)) {
      this.saveStoreInfo(DEFAULT_STORE_INFO);
    }
    if (!localStorage.getItem(STORAGE_KEYS.INQUIRIES)) {
      this.saveInquiries(DEFAULT_INQUIRIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADMIN_PIN)) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, "ppr2026");
    }
  }

  // Store Info
  getStoreInfo() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STORE_INFO);
      return data ? JSON.parse(data) : DEFAULT_STORE_INFO;
    } catch (e) {
      return DEFAULT_STORE_INFO;
    }
  }

  saveStoreInfo(info) {
    localStorage.setItem(STORAGE_KEYS.STORE_INFO, JSON.stringify(info));
  }

  // Products
  getProducts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : DEFAULT_PRODUCTS;
    } catch (e) {
      return DEFAULT_PRODUCTS;
    }
  }

  saveProducts(products) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id);
  }

  saveProduct(product) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      if (!product.id) {
        product.id = 'prod-' + Date.now();
      }
      products.unshift(product);
    }
    this.saveProducts(products);
    return product;
  }

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    this.saveProducts(products);
    return products;
  }

  // Specials
  getSpecials() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SPECIALS);
      const specials = data ? JSON.parse(data) : DEFAULT_SPECIALS;
      // Filter out auto-expired if requested, or keep for display
      return specials;
    } catch (e) {
      return DEFAULT_SPECIALS;
    }
  }

  getActiveSpecials() {
    const today = new Date().toISOString().split('T')[0];
    const specials = this.getSpecials();
    return specials.filter(s => {
      if (!s.active) return false;
      if (s.endDate && s.endDate < today) return false;
      return true;
    });
  }

  saveSpecials(specials) {
    localStorage.setItem(STORAGE_KEYS.SPECIALS, JSON.stringify(specials));
  }

  saveSpecial(special) {
    const specials = this.getSpecials();
    const index = specials.findIndex(s => s.id === special.id);
    if (index >= 0) {
      specials[index] = special;
    } else {
      if (!special.id) special.id = 'spec-' + Date.now();
      specials.unshift(special);
    }
    this.saveSpecials(specials);
    return special;
  }

  deleteSpecial(id) {
    let specials = this.getSpecials();
    specials = specials.filter(s => s.id !== id);
    this.saveSpecials(specials);
    return specials;
  }

  // Inquiries
  getInquiries() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      return data ? JSON.parse(data) : DEFAULT_INQUIRIES;
    } catch (e) {
      return DEFAULT_INQUIRIES;
    }
  }

  saveInquiries(inquiries) {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
  }

  addInquiry(inquiry) {
    const inquiries = this.getInquiries();
    inquiry.id = 'inq-' + Date.now();
    const now = new Date();
    inquiry.date = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    inquiry.status = "New";
    inquiries.unshift(inquiry);
    this.saveInquiries(inquiries);
    return inquiry;
  }

  updateInquiryStatus(id, status) {
    const inquiries = this.getInquiries();
    const inq = inquiries.find(i => i.id === id);
    if (inq) {
      inq.status = status;
      this.saveInquiries(inquiries);
    }
  }

  deleteInquiry(id) {
    let inquiries = this.getInquiries();
    inquiries = inquiries.filter(i => i.id !== id);
    this.saveInquiries(inquiries);
  }

  // Authentication
  getAdminPin() {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || "ppr2026";
  }

  setAdminPin(newPin) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, newPin);
  }

  checkAuth() {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === "authenticated";
  }

  login(pin) {
    if (pin === this.getAdminPin()) {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, "authenticated");
      return true;
    }
    return false;
  }

  logout() {
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }

  // Store Hours Calculator
  getStoreLiveStatus() {
    const info = this.getStoreInfo();
    const now = new Date();
    const dayIndex = now.getDay(); // 0 is Sunday, 1 is Monday...
    const currentHour = now.getHours() + (now.getMinutes() / 60);

    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const dayKey = dayNames[dayIndex];
    const todaySchedule = info.hours[dayKey];

    if (!todaySchedule) {
      return { isOpen: true, statusText: "Open Today", badgeClass: "status-open", todaySchedule: "9:00 AM - 11:00 PM" };
    }

    const isOpen = currentHour >= todaySchedule.openHour && currentHour < todaySchedule.closeHour;
    let statusText = "";
    let badgeClass = "";

    if (isOpen) {
      const hoursRemaining = todaySchedule.closeHour - currentHour;
      if (hoursRemaining <= 1) {
        statusText = `Open Now • Closes in ${Math.round(hoursRemaining * 60)} min (${todaySchedule.close})`;
        badgeClass = "status-closing";
      } else {
        statusText = `Open Now • Closes at ${todaySchedule.close}`;
        badgeClass = "status-open";
      }
    } else {
      statusText = `Closed Now • Opens at ${todaySchedule.open}`;
      badgeClass = "status-closed";
    }

    return {
      isOpen,
      statusText,
      badgeClass,
      todaySchedule: `${todaySchedule.label}: ${todaySchedule.open} - ${todaySchedule.close}`,
      dayKey
    };
  }

  // Reset to Factory Defaults
  resetAll() {
    this.saveProducts(DEFAULT_PRODUCTS);
    this.saveSpecials(DEFAULT_SPECIALS);
    this.saveStoreInfo(DEFAULT_STORE_INFO);
    this.saveInquiries(DEFAULT_INQUIRIES);
  }

  // Export JSON Backup
  exportAll() {
    return JSON.stringify({
      version: "1.0",
      exportDate: new Date().toISOString(),
      storeInfo: this.getStoreInfo(),
      products: this.getProducts(),
      specials: this.getSpecials(),
      inquiries: this.getInquiries()
    }, null, 2);
  }

  // Import JSON Backup
  importAll(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.storeInfo) this.saveStoreInfo(data.storeInfo);
      if (data.products) this.saveProducts(data.products);
      if (data.specials) this.saveSpecials(data.specials);
      if (data.inquiries) this.saveInquiries(data.inquiries);
      return true;
    } catch (e) {
      console.error("Import error", e);
      return false;
    }
  }
}

// Global Singleton Instance
window.pprDB = new PPRDatabase();
