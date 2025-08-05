using System.ComponentModel.DataAnnotations;

namespace ApiCadastroClientes.Models.DTO
{
    public class UsuarioDTO
    {
        [MinLength(2)]
        public string Nome { get; set; }
        
        public string Email { get; set; }
        [MinLength(4)]
        public string Senha { get; set; }
        [MinLength(9)]
        public string? Telefone { get; set; }
        [MinLength(11)]
        public string Cpf { get; set; }
        public string Endereco { get; set; }

    }   
}