using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClinicBooking.Migrations
{
    /// <inheritdoc />
    public partial class AllowNullForMedicineInventoryEntry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedicineInventoryEntries_Prescriptions_PrescriptionID",
                table: "MedicineInventoryEntries");

            migrationBuilder.AlterColumn<int>(
                name: "PrescriptionID",
                table: "MedicineInventoryEntries",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicineInventoryEntries_Prescriptions_PrescriptionID",
                table: "MedicineInventoryEntries",
                column: "PrescriptionID",
                principalTable: "Prescriptions",
                principalColumn: "PrescriptionID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedicineInventoryEntries_Prescriptions_PrescriptionID",
                table: "MedicineInventoryEntries");

            migrationBuilder.AlterColumn<int>(
                name: "PrescriptionID",
                table: "MedicineInventoryEntries",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_MedicineInventoryEntries_Prescriptions_PrescriptionID",
                table: "MedicineInventoryEntries",
                column: "PrescriptionID",
                principalTable: "Prescriptions",
                principalColumn: "PrescriptionID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
