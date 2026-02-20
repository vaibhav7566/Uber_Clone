import crypto from "crypto";
import { env } from "../../config/env.js";

// ============================================
// ENCRYPTION UTILITIES
// ============================================
// Provides functions to encrypt, decrypt, and mask sensitive data
// Uses AES-256-CBC encryption algorithm for security
// Primary use case: Encrypting Aadhar numbers in database

// ============================================
// ENCRYPTION ALGORITHM CONFIGURATION
// ============================================
const ALGORITHM = "aes-256-cbc"; // Advanced Encryption Standard with 256-bit key
const ENCRYPTION_KEY = env.ENCRYPTION_KEY || "your-32-character-secret-key!!aa"; // Must be 32 characters for AES-256
const IV_LENGTH = 16; // Initialization Vector length (16 bytes for AES)

// ============================================
// ENCRYPT FUNCTION
// ============================================
// Encrypts plain text data using AES-256-CBC
// Returns: encrypted_data:initialization_vector (format: "abc123:def456")
//
// How it works:
// 1. Generate random IV (Initialization Vector) for each encryption
// 2. Create cipher with algorithm, key, and IV
// 3. Encrypt the text
// 4. Return encrypted data + IV (IV needed for decryption)
//
// Example:
// Input: "123456789012"
// Output: "a1b2c3d4e5f6:1a2b3c4d5e6f7g8h"
export const encrypt = (text) => {
  // Step 1: Generate random 16-byte IV for this encryption
  // IV ensures same text encrypts to different values each time
  const iv = crypto.randomBytes(IV_LENGTH);

  // Step 2: Create cipher object with our algorithm, key, and IV
  const cipher = crypto.createCipheriv(
    //    Cipher = encryption machine / method that converts readable data into secret data
    ALGORITHM, // Algorithm: AES-256-CBC
    Buffer.from(ENCRYPTION_KEY.slice(0, 32)), // Key: First 32 chars of encryption key
    iv, // IV: Random initialization vector
  );

  // Step 3: Encrypt the text
  let encrypted = cipher.update(text, "utf8", "hex"); // Convert text to encrypted hex
  encrypted += cipher.final("hex"); // Finalize encryption

  // Step 4: Return encrypted data with IV (separated by colon)
  // Format: "encrypted_data:iv"
  // We need IV later for decryption
  return `${encrypted}:${iv.toString("hex")}`;
};
// ============================================
// DECRYPT FUNCTION
// ============================================
// Decrypts encrypted data back to original text
// Input format: "encrypted_data:initialization_vector"
// Returns: Original plain text
//
// How it works:
// 1. Split encrypted string to get data and IV
// 2. Create decipher with algorithm, key, and IV
// 3. Decrypt the data
// 4. Return original text
//
// Example:
// Input: "a1b2c3d4e5f6:1a2b3c4d5e6f7g8h"
// Output: "123456789012"
export const decrypt = (encryptedText) => {
  // Step 1: Split the encrypted string to extract data and IV
  // Format is "encrypted_data:iv"
  const parts = encryptedText.split(":");
  const encrypted = parts[0]; // The encrypted data
  const iv = Buffer.from(parts[1], "hex"); // The IV used during encryption

  // Step 2: Create decipher object with same algorithm, key, and IV
  const decipher = crypto.createDecipheriv(
    ALGORITHM, // Same algorithm used for encryption
    Buffer.from(ENCRYPTION_KEY.slice(0, 32)), // Same key used for encryption
    iv, // Same IV used for encryption
  );

  // Step 3: Decrypt the data
  let decrypted = decipher.update(encrypted, "hex", "utf8"); // Convert hex back to text
  decrypted += decipher.final("utf8"); // Finalize decryption

  // Step 4: Return original plain text
  return decrypted;
};

// ============================================
// MASK AADHAR FUNCTION
// ============================================
// Masks Aadhar number for display purposes
// Shows only last 4 digits, rest are X
// Format: XXXX XXXX 1234
//
// How it works:
// 1. Get last 4 digits of Aadhar
// 2. Replace first 8 digits with X
// 3. Add spaces for readability
//
// Example:
// Input: "123456789012"
// Output: "XXXX XXXX 9012"
export const maskAadhar = (aadharNumber) => {
  // Step 1: Validate input
  if (!aadharNumber || aadharNumber.length !== 12) {
    return "XXXX XXXX XXXX"; // Return fully masked if invalid
  }

  // Step 2: Get last 4 digits
  const lastFour = aadharNumber.slice(-4);

  // Step 3: Create masked format with spaces
  // Format: "XXXX XXXX [last4digits]"
  return `XXXX XXXX ${lastFour}`;
};

// ============================================
// Node.js module provides AES-256-CBC encryption utilities for securing sensitive data like Aadhaar numbers (12-digit Indian IDs) before database storage. It uses the built-in crypto module with a fixed key from environment variables, generating unique IVs per encryption and storing them alongside ciphertext for decryption.

// Crypto - Crypto is a Node.js module that provides cryptographic functions to secure data through encryption, hashing, and other security operations.

//  Cipher = encryption machine / method that converts readable data into secret data

// =========================================
// Detailed Explanation of encryption.js
// =========================================

// This file provides security utilities to encrypt, decrypt, and mask sensitive data (like Aadhaar numbers - 12-digit Indian IDs) before storing them in the database.

// ============================================
// 1. CORE CONFIGURATION
// =============================================
// Key Terms:

// AES-256-CBC: Advanced Encryption Standard with 256-bit key and Cipher Block Chaining mode

// 256-bit: The key length (32 characters). Longer key = stronger security
// CBC: Cipher Block Chaining mode - encrypts data in blocks, each block depends on previous ones
// ENCRYPTION_KEY: A secret password (32 characters) from environment variables. Must be kept private

// IV (Initialization Vector): A random 16-byte value generated for each encryption. It ensures:

// Same plaintext encrypts to different ciphertext each time (better security)
// Required for decryption

// =============================================
// 2. ENCRYPT FUNCTION
// =============================================

// What it does: Converts plain text to encrypted text

// How it works:

// Generate random IV → Creates a unique random value for this encryption
// Create cipher object → Sets up encryption machine with algorithm, key, and IV
// Encrypt text → Converts readable text to unreadable encrypted hex string
// Return → Format: "encrypted_data:iv" (colon-separated)
// Example:

// Input: "123456789012" (Aadhaar number)
// Output: "a1b2c3d4e5f6:1a2b3c4d5e6f7g8h" (encrypted:iv)
// Key Parameters in cipher.update(text, "utf8", "hex"):

// text → Data to encrypt
// "utf8" → Input format (normal readable text)
// "hex" → Output format (hexadecimal string - compact encrypted representation)

// =============================================
// 3. DECRYPT FUNCTION
// =============================================
// What it does: Converts encrypted text back to original plain text

// How it works:
// Split encrypted string → Extracts encrypted data and IV from "encrypted_data:iv"
// Create decipher object → Sets up decryption machine with same algorithm, key, and IV
// Decrypt data → Converts encrypted hex back to readable text
// Return original text

// Example:

// Input: "a1b2c3d4e5f6:1a2b3c4d5e6f7g8h"
// Output: "123456789012" (original Aadhaar number)

// Important: Uses same key and IV that were used during encryption - without them, decryption is impossible!

// =============================================

// 4. MASK AADHAR FUNCTION
// What it does: Masks Aadhaar number for display (shows only last 4 digits)
// How it works:
// Validate input → Checks if Aadhaar number is valid (12 digits)
// Get last 4 digits → Extracts the last 4 characters of the Aadhaar number
// Create masked format → Replaces first 8 digits with "X" and adds spaces for readability
// Example:

// Input: "123456789012"
// Output: "XXXX XXXX 9012" (masked for display)

//=============================================

// KEY SECURITY CONCEPTS
// Term	Meaning
// Cipher -Encryption machine/algorithm that converts readable data into secret data
// Plaintext -	Original readable data
// Ciphertext -	Encrypted unreadable data
// Key- 	Secret password needed for encryption/decryption
// IV-	Random value that makes same plaintext encrypt differently each time
// Decipher	 ->Decryption machine - reverses cipher operation
// Hex	-> Hexadecimal format - compact representation of encrypted data

//=============================================

