using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BanDo.Models
{
    public class Slot
    {
        [Key]
        public int Id { get; set; }
        public string Name {get; set;}
        public string Direction { get; set; }
        public float LongInMeter { get; set; }
        public float WidthInMeter { get; set; }
        public float WidthOfStreetInMeter { get; set; }
        public DateTime AddedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        public int? ProductId { get; set; }
        [ForeignKey("ProductId")]
        public Product Product { get; set; }
    }
}
