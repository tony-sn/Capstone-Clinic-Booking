using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClinicBooking.Migrations
{
    /// <inheritdoc />
    public partial class newforgeinKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Images_LaboratoryTestReports_LaboratoryTestReportMedicalHistoryId_LaboratoryTestReportLaboratoryTestId",
                table: "Images");

            migrationBuilder.AlterColumn<int>(
                name: "LaboratoryTestReportMedicalHistoryId",
                table: "Images",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "LaboratoryTestReportLaboratoryTestId",
                table: "Images",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Images_LaboratoryTestReports_LaboratoryTestReportMedicalHistoryId_LaboratoryTestReportLaboratoryTestId",
                table: "Images",
                columns: new[] { "LaboratoryTestReportMedicalHistoryId", "LaboratoryTestReportLaboratoryTestId" },
                principalTable: "LaboratoryTestReports",
                principalColumns: new[] { "MedicalHistoryId", "LaboratoryTestId" },
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Images_LaboratoryTestReports_LaboratoryTestReportMedicalHistoryId_LaboratoryTestReportLaboratoryTestId",
                table: "Images");

            migrationBuilder.AlterColumn<int>(
                name: "LaboratoryTestReportMedicalHistoryId",
                table: "Images",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "LaboratoryTestReportLaboratoryTestId",
                table: "Images",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Images_LaboratoryTestReports_LaboratoryTestReportMedicalHistoryId_LaboratoryTestReportLaboratoryTestId",
                table: "Images",
                columns: new[] { "LaboratoryTestReportMedicalHistoryId", "LaboratoryTestReportLaboratoryTestId" },
                principalTable: "LaboratoryTestReports",
                principalColumns: new[] { "MedicalHistoryId", "LaboratoryTestId" });
        }
    }
}
