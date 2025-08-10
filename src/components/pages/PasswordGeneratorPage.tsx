"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiCopy, FiRefreshCw, FiCheck, FiKey, FiSettings, FiShield } from "react-icons/fi";

export function PasswordGeneratorPage() {
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, "");
    }
    
    if (excludeAmbiguous) {
      charset = charset.replace(/[{}[\]\\/"'`~,;:.<>]/g, "");
    }

    if (charset === "") {
      setGeneratedPassword("");
      return;
    }

    let password = "";
    for (let i = 0; i < passwordLength; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setGeneratedPassword(password);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    if (generatedPassword) {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getPasswordStrength = () => {
    if (!generatedPassword) return { score: 0, label: "No Password", color: "text-gray-400" };
    
    let score = 0;
    if (generatedPassword.match(/[a-z]/)) score += 1;
    if (generatedPassword.match(/[A-Z]/)) score += 1;
    if (generatedPassword.match(/[0-9]/)) score += 1;
    if (generatedPassword.match(/[^A-Za-z0-9]/)) score += 1;
    if (generatedPassword.length >= 12) score += 1;
    if (generatedPassword.length >= 16) score += 1;

    if (score <= 2) return { score, label: "Weak", color: "text-red-400" };
    if (score <= 3) return { score, label: "Fair", color: "text-yellow-400" };
    if (score <= 4) return { score, label: "Good", color: "text-blue-400" };
    return { score, label: "Strong", color: "text-green-400" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Password Generator</h1>
        <p className="text-gray-400">Create strong, secure passwords with customizable options</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Generator Section */}
        <div className="space-y-6">
          {/* Generated Password Display */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Generated Password</h2>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={generatedPassword}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Click 'Generate Password'"
                />
                <button
                  onClick={copyToClipboard}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-600 rounded transition-colors"
                >
                  {copied ? <FiCheck className="h-5 w-5 text-green-400" /> : <FiCopy className="h-5 w-5 text-gray-400" />}
                </button>
              </div>

              {/* Password Strength */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Strength:</span>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-3 h-2 rounded ${
                          level <= strength.score ? strength.color.replace('text-', 'bg-') : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-sm font-medium ${strength.color}`}>
                    {strength.label}
                  </span>
                </div>
              </div>

              {/* Generate Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generatePassword}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <FiRefreshCw className="h-5 w-5" />
                <span>Generate Password</span>
              </motion.button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Quick Generate</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setPasswordLength(8);
                  setIncludeUppercase(true);
                  setIncludeLowercase(true);
                  setIncludeNumbers(true);
                  setIncludeSymbols(false);
                  generatePassword();
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors"
              >
                <div className="text-sm font-medium">Simple</div>
                <div className="text-xs text-blue-200">8 chars, no symbols</div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setPasswordLength(12);
                  setIncludeUppercase(true);
                  setIncludeLowercase(true);
                  setIncludeNumbers(true);
                  setIncludeSymbols(true);
                  generatePassword();
                }}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition-colors"
              >
                <div className="text-sm font-medium">Standard</div>
                <div className="text-xs text-green-200">12 chars, all types</div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setPasswordLength(20);
                  setIncludeUppercase(true);
                  setIncludeLowercase(true);
                  setIncludeNumbers(true);
                  setIncludeSymbols(true);
                  setExcludeSimilar(true);
                  generatePassword();
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-lg transition-colors"
              >
                <div className="text-sm font-medium">Strong</div>
                <div className="text-xs text-purple-200">20 chars, complex</div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setPasswordLength(32);
                  setIncludeUppercase(true);
                  setIncludeLowercase(true);
                  setIncludeNumbers(true);
                  setIncludeSymbols(true);
                  setExcludeSimilar(true);
                  setExcludeAmbiguous(true);
                  generatePassword();
                }}
                className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition-colors"
              >
                <div className="text-sm font-medium">Ultra</div>
                <div className="text-xs text-red-200">32 chars, maximum</div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <FiSettings className="h-5 w-5" />
              <span>Generator Settings</span>
            </h2>
            
            <div className="space-y-6">
              {/* Password Length */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password Length: {passwordLength}
                </label>
                <input
                  type="range"
                  min="4"
                  max="64"
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>4</span>
                  <span>64</span>
                </div>
              </div>

              {/* Character Types */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">Character Types</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={includeUppercase}
                      onChange={(e) => setIncludeUppercase(e.target.checked)}
                      className="w-4 h-4 text-teal-500 bg-gray-700 border-gray-600 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm">Uppercase letters (A-Z)</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={includeLowercase}
                      onChange={(e) => setIncludeLowercase(e.target.checked)}
                      className="w-4 h-4 text-teal-500 bg-gray-700 border-gray-600 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm">Lowercase letters (a-z)</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={includeNumbers}
                      onChange={(e) => setIncludeNumbers(e.target.checked)}
                      className="w-4 h-4 text-teal-500 bg-gray-700 border-gray-600 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm">Numbers (0-9)</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={includeSymbols}
                      onChange={(e) => setIncludeSymbols(e.target.checked)}
                      className="w-4 h-4 text-teal-500 bg-gray-700 border-gray-600 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm">Symbols (!@#$%^&*)</span>
                  </label>
                </div>
              </div>

              {/* Exclusions */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">Exclusions</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={excludeSimilar}
                      onChange={(e) => setExcludeSimilar(e.target.checked)}
                      className="w-4 h-4 text-teal-500 bg-gray-700 border-gray-600 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm">Exclude similar characters (i, l, 1, L, o, 0, O)</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={excludeAmbiguous}
                      onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                      className="w-4 h-4 text-teal-500 bg-gray-700 border-gray-600 rounded focus:ring-teal-500"
                    />
                  <span className="text-sm">Exclude ambiguous characters (&#123; &#125; &#91; &#93; &#92; &#47; &quot; &apos; &#96; ~ , ; : . &#60; &#62;)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Password Tips */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <FiShield className="h-5 w-5" />
              <span>Security Tips</span>
            </h2>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Use at least 12 characters for better security</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Include a mix of uppercase, lowercase, numbers, and symbols</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Avoid using personal information like names or birthdays</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Use unique passwords for each account</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Consider using a passphrase for maximum security</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 