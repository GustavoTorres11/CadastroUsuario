namespace ApiNotasSimples.Models
{
    public class Response <T>
    {
        public T Data {get; set;}
        
        public string Mensage { get; set; }

        public bool Status { get; set; }


        public Response(T data, string mensage, bool status)
        {
            Data = data;
            Mensage = mensage;
            Status = status;
        }
    }
}
