using System.ComponentModel.DataAnnotations;

namespace ApiNotasSimples.Models
{
    public class UsuarioModel
    {
        public Guid Id { get; set; } = Guid.NewGuid();
       public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Telefone { get; set; }
        public string Cpf { get; set; }
        public string Endereco { get; set; }

        // Campo que define o tipo de usuário
        public string Role { get; set; } = "user"; // padrão é 'user'

        //public IList<Address> Addresses { get; set; }

        public bool Record_status { get; set; } = true;

        public UsuarioModel ()
        {
            //this.Addresses = new List<Address>();
        }



    }
}