using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ApiNotasSimples.Models;

namespace ApiNotasSimples.Services
{
    public class TokenService
    {
        public static string GerarToken(UsuarioModel usuario)
        {
            var key = Encoding.ASCII.GetBytes("sua-chave-super-secreta-123456789012");

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, usuario.Email),
                new Claim(ClaimTypes.Role, usuario.Role) // "admin" ou "user"
            };

            var tokenConfig = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenConfig);

            return tokenHandler.WriteToken(token);
        }
    }
}