<?php
session_start();

$dataFile = 'data.json';

// Helper function to read data
function readData() {
    global $dataFile;
    if (!file_exists($dataFile)) {
        return ['products' => [], 'activities' => []];
    }
    $json = file_get_contents($dataFile);
    return json_decode($json, true);
}

// Helper function to write data
function writeData($data) {
    global $dataFile;
    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
}

// Authentication Check
function isAuthenticated() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

// Request parameters
$action = $_GET['action'] ?? '';
header('Content-Type: application/json');

switch ($action) {
    // --- PUBLIC ENDPOINTS ---
    case 'get_products':
        $data = readData();
        // Sort by ID descending (newest first)
        $products = $data['products'] ?? [];
        usort($products, function($a, $b) { return $b['id'] <=> $a['id']; });
        echo json_encode($products);
        break;

    case 'get_activities':
        $data = readData();
        // Sort activities descending (assuming ID works as proxy for newness)
        $activities = $data['activities'] ?? [];
        usort($activities, function($a, $b) { return $b['id'] <=> $a['id']; });
        echo json_encode($activities);
        break;

    // --- AUTHENTICATION ---
    case 'login':
        $input = json_decode(file_get_contents('php://input'), true);
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';

        // Hardcoded simple authentication for extreme simplicity
        if ($username === 'admin' && $password === 'admin123') {
            $_SESSION['admin_logged_in'] = true;
            echo json_encode(['message' => 'Login sukses']);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Username atau password salah']);
        }
        break;

    case 'logout':
        session_destroy();
        echo json_encode(['message' => 'Logout sukses']);
        break;

    case 'check_auth':
        if (isAuthenticated()) {
            echo json_encode(['status' => 'logged_in']);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Tidak ada akses']);
        }
        break;

    // --- ADMIN ENDPOINTS (Protected) ---
    case 'add_product':
        if (!isAuthenticated()) { http_response_code(401); echo json_encode(['error' => 'Tidak ada akses']); exit; }
        
        $input = json_decode(file_get_contents('php://input'), true);
        $data = readData();
        
        $newId = 1;
        if (!empty($data['products'])) {
            $newId = max(array_column($data['products'], 'id')) + 1;
        }

        $newProduct = [
            'id' => $newId,
            'name' => $input['name'] ?? '',
            'category' => $input['category'] ?? '',
            'price' => $input['price'] ?? '',
            'seller' => $input['seller'] ?? '',
            'sellerImg' => $input['sellerImg'] ?? '',
            'rating' => '5.0',
            'reviews' => '0',
            'stock' => $input['stock'] ?? 'tersedia',
            'desc' => $input['desc'] ?? '',
            'material' => $input['material'] ?? '',
            'size' => $input['size'] ?? '',
            'weight' => $input['weight'] ?? '',
            'image' => $input['image'] ?? '',
            'whatsapp' => $input['whatsapp'] ?? ''
        ];

        $data['products'][] = $newProduct;
        writeData($data);
        echo json_encode(['message' => 'Produk berhasil ditambahkan', 'id' => $newId]);
        break;
    case 'edit_product':
        if (!isAuthenticated()) { http_response_code(401); echo json_encode(['error' => 'Tidak ada akses']); exit; }
        
        $input = json_decode(file_get_contents('php://input'), true);
        $data = readData();
        $idToEdit = (int)($input['id'] ?? 0);
        
        $found = false;
        foreach ($data['products'] as &$p) {
            if ($p['id'] === $idToEdit) {
                $p['name'] = $input['name'] ?? $p['name'];
                $p['category'] = $input['category'] ?? $p['category'];
                $p['price'] = $input['price'] ?? $p['price'];
                $p['seller'] = $input['seller'] ?? $p['seller'];
                $p['sellerImg'] = $input['sellerImg'] ?? $p['sellerImg'];
                $p['stock'] = $input['stock'] ?? $p['stock'];
                $p['desc'] = $input['desc'] ?? $p['desc'];
                $p['material'] = $input['material'] ?? $p['material'];
                $p['size'] = $input['size'] ?? $p['size'];
                $p['weight'] = $input['weight'] ?? $p['weight'];
                $p['image'] = $input['image'] ?? $p['image'];
                $p['whatsapp'] = $input['whatsapp'] ?? $p['whatsapp'];
                $found = true;
                break;
            }
        }
        
        if ($found) {
            writeData($data);
            echo json_encode(['message' => 'Produk berhasil diubah']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Produk tidak ditemukan']);
        }
        break;

    case 'delete_product':
        if (!isAuthenticated()) { http_response_code(401); echo json_encode(['error' => 'Tidak ada akses']); exit; }
        
        $idToDelete = (int)($_GET['id'] ?? 0);
        $data = readData();
        
        $data['products'] = array_filter($data['products'], function($p) use ($idToDelete) {
            return $p['id'] !== $idToDelete;
        });
        
        // Re-index array to prevent JSON from turning it into an object
        $data['products'] = array_values($data['products']);
        writeData($data);
        echo json_encode(['message' => 'Produk berhasil dihapus']);
        break;

    case 'add_activity':
        if (!isAuthenticated()) { http_response_code(401); echo json_encode(['error' => 'Tidak ada akses']); exit; }
        
        $input = json_decode(file_get_contents('php://input'), true);
        $data = readData();
        
        $newId = 1;
        if (!empty($data['activities'])) {
            $newId = max(array_column($data['activities'], 'id')) + 1;
        }

        $newActivity = [
            'id' => $newId,
            'title' => $input['title'] ?? '',
            'category' => $input['category'] ?? '',
            'date' => $input['date'] ?? '',
            'description' => $input['description'] ?? '',
            'image' => $input['image'] ?? ''
        ];

        $data['activities'][] = $newActivity;
        writeData($data);
        echo json_encode(['message' => 'Kegiatan berhasil ditambahkan', 'id' => $newId]);
        break;

    case 'delete_activity':
        if (!isAuthenticated()) { http_response_code(401); echo json_encode(['error' => 'Tidak ada akses']); exit; }
        
        $idToDelete = (int)($_GET['id'] ?? 0);
        $data = readData();
        
        $data['activities'] = array_filter($data['activities'], function($a) use ($idToDelete) {
            return $a['id'] !== $idToDelete;
        });
        
        $data['activities'] = array_values($data['activities']);
        writeData($data);
        echo json_encode(['message' => 'Kegiatan berhasil dihapus']);
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint tidak ditemukan']);
        break;
}
?>
