using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace ApiCadastroClientes.Services
{
    public class CryptoService
    {
        private readonly byte[] _salt;
        private readonly ILogger<CryptoService> _logger;

        public CryptoService(ILogger<CryptoService> logger)
        {
            _logger = logger;
            _salt = File.Exists("salt.json") ? Convert.FromBase64String(JsonSerializer.Deserialize<SaltData>(File.ReadAllText("salt.json")).Salt) : GenerateSalt();
        }

        private byte[] GenerateSalt()
        {
            byte[] salt = new byte[16];
            using (var rng = RandomNumberGenerator.Create()) rng.GetBytes(salt);
            File.WriteAllText("salt.json", JsonSerializer.Serialize(new { Salt = Convert.ToBase64String(salt) }));
            return salt;
        }

        public string HashPassword(string password) => Convert.ToBase64String(new HMACSHA256(_salt).ComputeHash(Encoding.UTF8.GetBytes(password ?? throw new ArgumentException("Senha nula"))));

        public bool VerifyPassword(string password, string hashedPassword) => HashPassword(password) == hashedPassword;

        public class SaltData { public string Salt { get; set; } }
    }
}