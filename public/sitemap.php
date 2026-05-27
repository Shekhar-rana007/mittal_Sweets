<?php

// Function to fetch data from API
function fetchData($url) {
    $response = file_get_contents($url);
    if ($response !== false) {
        return json_decode($response, true);
    } else {
        return false;
    }
}

// API URLs
$productUrl = 'https://backend-9mwl.onrender.com/all-products';
$categoryUrl = 'https://backend-9mwl.onrender.com/all-category';

// Fetch product data
$productData = fetchData($productUrl);

// Fetch category data
$categoryData = fetchData($categoryUrl);

// Custom URLs
$customUrls = [
    'https://cayroshop.com/about-us',
    'https://cayroshop.com/contact',
    'https://cayroshop.com/page/65f84522dabc2fa9d8b6d96d',
    'https://cayroshop.com/page/65f845dbdabc2fa9d8b6d972',
    'https://cayroshop.com/page/65f84722dabc2fa9d8b6d976',
    // Add more custom URLs as needed
];

// Check if both product and category data are fetched successfully
if ($productData !== false && $categoryData !== false) {
    // Initialize XML string
    $xml = '<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url>
                <loc>https://cayroshop.com/</loc>
                <changefreq>daily</changefreq>
                <priority>1</priority>
            </url>';

  // Loop through custom URLs and add them to sitemap
    foreach ($customUrls as $url) {
        $encodedUrl = htmlspecialchars($url);
        $xml .= '<url>
                    <loc>' . $encodedUrl . '</loc>
                    <changefreq>monthly</changefreq>
                    <priority>0.8</priority>
                </url>';
    }


    // Loop through product data and add product URLs to sitemap
    foreach ($productData['products'] as $product) {
        $encodedId = htmlspecialchars($product['_id']);
        $xml .= '<url>
                    <loc>https://cayroshop.com/product/' . $encodedId . '</loc>
                    <changefreq>daily</changefreq>
                    <priority>0.8</priority>
                </url>';
    }

    // Loop through category data and add category URLs to sitemap
    foreach ($categoryData['categories'] as $category) {
        $encodedId = htmlspecialchars($category['_id']);
        $xml .= '<url>
                    <loc>https://cayroshop.com/category/' . $encodedId . '</loc>
                    <changefreq>weekly</changefreq>
                    <priority>0.8</priority>
                </url>';
    }

  
    // Close XML string
    $xml .= '</urlset>';

    // Output sitemap XML
    header('Content-type: application/xml');
    echo $xml;
} else {
    // Error handling if unable to fetch data from one or both APIs
    echo "Error fetching data from API(s)";
}
?>
