using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClinicBooking.Migrations
{
    /// <inheritdoc />
    public partial class ChangeNameFieldPriceToTotalAmountInTableMedicalHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Price",
                table: "MedicalHistories",
                newName: "TotalAmount");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TotalAmount",
                table: "MedicalHistories",
                newName: "Price");
        }
    }
}
