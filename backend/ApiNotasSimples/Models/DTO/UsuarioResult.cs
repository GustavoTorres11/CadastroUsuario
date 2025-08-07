namespace ApiNotasSimples.Models.DTO
{
    public class UsuarioResult
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public string Cpf { get; set; }
        public string Endereco { get; set; }

        public string Role { get; set; }

        public UsuarioResult () {}


        public UsuarioResult(UsuarioModel usuario)
        {
            this.Id = usuario.Id;
            this.Name = usuario.Name;
            this.Email = usuario.Email;
            this.Telefone = usuario.Telefone;
            this.Cpf = usuario.Cpf;
            this.Endereco = usuario.Endereco;
            this.Role = usuario.Role;
        }




    }

}
