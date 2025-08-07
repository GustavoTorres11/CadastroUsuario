using System.Text.RegularExpressions;

namespace ApiNotasSimples.Services
{
    public class RegexService
    {
        public bool ValidarEmail(string email)
        {
            var pattern = @"^[\w\.-]+@[\w\.-]+\.\w+$";
            return Regex.IsMatch(email, pattern);
        }

        public bool ValidarTelefone(string telefone)
        {
            var pattern = @"^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$";
            return Regex.IsMatch(telefone, pattern);
        }

        public bool ValidarSenha(string password)
        {
            // Mínimo 6 caracteres e pelo menos 1 letra maiúscula
            var pattern = @"^(?=.*[A-Z]).{6,}$";
            return Regex.IsMatch(password, pattern);
        }
    }
}
