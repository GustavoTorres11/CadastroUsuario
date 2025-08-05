using System.ComponentModel.DataAnnotations;

namespace ApiCadastroClientes.Models.DTO
{
    public class LoginDTO
    {
        public string Email { get; set; }
        [MinLength(4)]
        public string Senha { get; set; }
    }
}