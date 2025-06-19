using ClinicBooking.Models;
using ClinicBooking_Utility;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using static Org.BouncyCastle.Asn1.Cmp.Challenge;

namespace ClinicBooking.Data
{
    public class DbInitializer
    {
        public static async Task SeedData(ApplicationDbContext context, UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            if (!context.Departments.Any())
            {
                var departments = new List<Department>
                {
                    new Department { DepartmentName = "Cardiology" },
                    new Department { DepartmentName = "Neurology" },
                    new Department { DepartmentName = "Pediatrics" },
                    new Department { DepartmentName = "Orthopedics" },
                    new Department { DepartmentName = "Oncology" }
                };
                context.Departments.AddRange(departments);
                await context.SaveChangesAsync();
            }

            if (!roleManager.Roles.Any())
            {
                var roles = new List<Role>
            {
                new() {Name = "User"},
                new() {Name = "Admin"},
                new() {Name = "Staff"},
                new() {Name = "Doctor"},
            };

                foreach (var role in roles)
                {
                    await roleManager.CreateAsync(role);
                }
            }
            if (!userManager.Users.Any())
            {
                var users = new List<User>
                {
                    new() {FirstName = "Khuong", LastName = "Le Huu", UserName = "ilehuukhuong@gmail.com", Email = "ilehuukhuong@gmail.com", EmailConfirmed = true},
                    new() {FirstName = "Admin", LastName = string.Empty, UserName = "admin@admin.com", Email = "admin@admin.com", EmailConfirmed = true},
                    new() {FirstName = "Tu", LastName = "Le", UserName = "lqanhtu@gmail.com", Email = "lqanhtu@gmail.com", EmailConfirmed = true},
                    new() {FirstName = "Tony", LastName = "Chopper", UserName = "tonychopper@admin.com", Email = "tonychopper@admin.com", EmailConfirmed = true},
                    new() {FirstName = "Phat", LastName = "Nguyen Hoang", UserName = "nguyenhoangphat@admin.com", Email = "nguyenhoangphat@admin.com", EmailConfirmed = true},
                    new() { FirstName = "John", LastName = "Smith", UserName = "johnsmith@example.com", Email = "johnsmith@example.com", EmailConfirmed = true },
                    new() { FirstName = "Emily", LastName = "Johnson", UserName = "emilyjohnson@example.com", Email = "emilyjohnson@example.com", EmailConfirmed = true },
                    new() { FirstName = "Michael", LastName = "Brown", UserName = "michaelbrown@example.com", Email = "michaelbrown@example.com", EmailConfirmed = true },
                    new() { FirstName = "Sophia", LastName = "Davis", UserName = "sophiadavis@example.com", Email = "sophiadavis@example.com", EmailConfirmed = true },
                    new() { FirstName = "William", LastName = "Miller", UserName = "williammiller@example.com", Email = "williammiller@example.com", EmailConfirmed = true },
                    new() { FirstName = "Olivia", LastName = "Wilson", UserName = "oliviawilson@example.com", Email = "oliviawilson@example.com", EmailConfirmed = true },
                    new() { FirstName = "James", LastName = "Moore", UserName = "jamesmoore@example.com", Email = "jamesmoore@example.com", EmailConfirmed = true },
                    new() { FirstName = "Ava", LastName = "Taylor", UserName = "avataylor@example.com", Email = "avataylor@example.com", EmailConfirmed = true },
                    new() { FirstName = "Benjamin", LastName = "Anderson", UserName = "benjaminanderson@example.com", Email = "benjaminanderson@example.com", EmailConfirmed = true },
                    new() { FirstName = "Isabella", LastName = "Thomas", UserName = "isabellathomas@example.com", Email = "isabellathomas@example.com", EmailConfirmed = true },
                    new() { FirstName = "Daniel", LastName = "Jackson", UserName = "danieljackson@example.com", Email = "danieljackson@example.com", EmailConfirmed = true },
                    new() { FirstName = "Mia", LastName = "White", UserName = "miawhite@example.com", Email = "miawhite@example.com", EmailConfirmed = true },
                    new() { FirstName = "Henry", LastName = "Harris", UserName = "henryharris@example.com", Email = "henryharris@example.com", EmailConfirmed = true },
                    new() { FirstName = "Charlotte", LastName = "Martin", UserName = "charlottemartin@example.com", Email = "charlottemartin@example.com", EmailConfirmed = true },
                    new() { FirstName = "Lucas", LastName = "Clark", UserName = "lucasclark@example.com", Email = "lucasclark@example.com", EmailConfirmed = true },
                    new() { FirstName = "Amelia", LastName = "Lewis", UserName = "amelialewis@example.com", Email = "amelialewis@example.com", EmailConfirmed = true },
                    new() { FirstName = "Logan", LastName = "Walker", UserName = "loganwalker@example.com", Email = "loganwalker@example.com", EmailConfirmed = true },
                    new() { FirstName = "Harper", LastName = "Hall", UserName = "harperhall@example.com", Email = "harperhall@example.com", EmailConfirmed = true },
                    new() { FirstName = "Alexander", LastName = "Allen", UserName = "alexanderallen@example.com", Email = "alexanderallen@example.com", EmailConfirmed = true },
                    new() { FirstName = "Evelyn", LastName = "Young", UserName = "evelynyoung@example.com", Email = "evelynyoung@example.com", EmailConfirmed = true },
                    new() { FirstName = "Sebastian", LastName = "King", UserName = "sebastianking@example.com", Email = "sebastianking@example.com", EmailConfirmed = true },
                    new() { FirstName = "Abigail", LastName = "Wright", UserName = "abigailwright@example.com", Email = "abigailwright@example.com", EmailConfirmed = true },
                    new() { FirstName = "Jack", LastName = "Scott", UserName = "jackscott@example.com", Email = "jackscott@example.com", EmailConfirmed = true },
                    new() { FirstName = "Ella", LastName = "Green", UserName = "ellagreen@example.com", Email = "ellagreen@example.com", EmailConfirmed = true },
                    new() { FirstName = "Samuel", LastName = "Baker", UserName = "samuelbaker@example.com", Email = "samuelbaker@example.com", EmailConfirmed = true },
                    new() { FirstName = "Lily", LastName = "Adams", UserName = "lilyadams@example.com", Email = "lilyadams@example.com", EmailConfirmed = true },
                    new() { FirstName = "David", LastName = "Nelson", UserName = "davidnelson@example.com", Email = "davidnelson@example.com", EmailConfirmed = true },
                    new() { FirstName = "Grace", LastName = "Carter", UserName = "gracecarter@example.com", Email = "gracecarter@example.com", EmailConfirmed = true },
                    new() { FirstName = "Joseph", LastName = "Mitchell", UserName = "josephmitchell@example.com", Email = "josephmitchell@example.com", EmailConfirmed = true }

                };


                for (int i = 0; i < users.Count; i++)
                {
                    var user = users[i];
                    var result = await userManager.CreateAsync(user, "Pa$$w0rd");
                    if (result.Succeeded)
                    {
                        if (i < 5)
                            await userManager.AddToRoleAsync(user, "Admin");
                        else if (i < 9)
                            await userManager.AddToRoleAsync(user, "Staff");
                        else if (i < 19)
                            await userManager.AddToRoleAsync(user, "Doctor");
                        else
                            await userManager.AddToRoleAsync(user, "User");
                    }
                }
            }

            await context.SaveChangesAsync();


            if (!context.Doctors.Any())
            {
                var departments = await context.Departments.ToListAsync();
                var random = new Random();

                // Lấy danh sách user Doctor
                var doctorUsers = await userManager.GetUsersInRoleAsync("Doctor");

                foreach (var doctorUser in doctorUsers)
                {
                    var randomDept = departments[random.Next(departments.Count)];

                    var doctor = new Doctor
                    {
                        UserId = doctorUser.Id,
                        DepartmentID = randomDept.DepartmentID,
                        Certificate = $"Certified in {randomDept.DepartmentName}"
                    };

                    context.Doctors.Add(doctor);
                }

                await context.SaveChangesAsync();
            }

            if (!context.Medicines.Any())
            {
                var medicineNames = new List<(string Name, string Description, decimal Price)>
                {
                    ("Paracetamol", "Pain reliever and fever reducer", 5),
                    ("Amoxicillin", "Antibiotic for bacterial infections", 10),
                    ("Ibuprofen", "Anti-inflammatory and pain relief", 7),
                    ("Cetirizine", "Antihistamine for allergy relief", 4),
                    ("Omeprazole", "Reduces stomach acid", 8),
                    ("Metformin", "Used for type 2 diabetes", 12),
                    ("Amlodipine", "Treats high blood pressure", 9),
                    ("Lisinopril", "ACE inhibitor for hypertension", 11),
                    ("Simvastatin", "Lowers cholesterol", 13),
                    ("Salbutamol", "Relieves asthma symptoms", 6),
                    ("Azithromycin", "Antibiotic for infections", 14),
                    ("Hydrochlorothiazide", "Diuretic for hypertension", 7),
                    ("Ranitidine", "Reduces stomach acid", 8),
                    ("Clopidogrel", "Prevents blood clots", 15),
                    ("Losartan", "Treats high blood pressure", 10),
                    ("Levothyroxine", "Treats hypothyroidism", 9),
                    ("Atorvastatin", "Lowers cholesterol", 13),
                    ("Diazepam", "Anti-anxiety", 6),
                    ("Prednisolone", "Anti-inflammatory steroid", 7),
                    ("Warfarin", "Blood thinner", 14),
                    ("Furosemide", "Diuretic", 8),
                    ("Ciprofloxacin", "Antibiotic", 12),
                    ("Doxycycline", "Antibiotic", 10),
                    ("Fluconazole", "Antifungal", 11),
                    ("Citalopram", "Antidepressant", 9),
                    ("Sertraline", "Antidepressant", 9),
                    ("Escitalopram", "Antidepressant", 10),
                    ("Venlafaxine", "Antidepressant", 11),
                    ("Mirtazapine", "Antidepressant", 10),
                    ("Quetiapine", "Antipsychotic", 12),
                    ("Olanzapine", "Antipsychotic", 13),
                    ("Risperidone", "Antipsychotic", 12),
                    ("Lamotrigine", "Anti-epileptic", 11),
                    ("Valproate", "Anti-epileptic", 10),
                    ("Carbamazepine", "Anti-epileptic", 9),
                    ("Lithium", "Mood stabilizer", 14),
                    ("Methotrexate", "Immunosuppressant", 13),
                    ("Sulfasalazine", "Anti-inflammatory", 12),
                    ("Allopurinol", "Treats gout", 8),
                    ("Colchicine", "Treats gout", 7),
                    ("Alendronate", "Treats osteoporosis", 11),
                    ("Calcium carbonate", "Calcium supplement", 6),
                    ("Cholecalciferol", "Vitamin D supplement", 5),
                    ("Ferrous sulfate", "Iron supplement", 4),
                    ("Folic acid", "Vitamin supplement", 3),
                    ("Vitamin B complex", "Vitamin supplement", 5),
                    ("Multivitamin", "General vitamin supplement", 6),
                    ("Zinc sulfate", "Zinc supplement", 4),
                    ("Magnesium oxide", "Magnesium supplement", 4)
                };

                var medicines = medicineNames.Select(m => new Medicine
                {
                    MedicineName = m.Name,
                    Description = m.Description,
                    Quantity = 0,
                    UnitPrice = m.Price
                }).ToList();

                context.Medicines.AddRange(medicines);
                await context.SaveChangesAsync();
            }

            // Lấy list medicine từ DB
            var medicineList = await context.Medicines.ToListAsync();

            if (!context.MedicineInventoryEntries.Any())
            {
                var random = new Random();
                var inventoryEntries = new List<MedicineInventoryEntry>();

                foreach (var med in medicineList)
                {
                    var quantity = random.Next(50, 201);
                    med.Quantity += quantity;

                    inventoryEntries.Add(new MedicineInventoryEntry
                    {
                        MedicineID = med.MedicineID,
                        ChangeType = ChangeType.Inbound,
                        Quantity = quantity,
                        Timestamp = DateTime.Now.AddDays(-random.Next(1, 30)),
                        CompanyName = "Global Pharma Ltd.",
                        Note = $"Initial stock inbound for {med.MedicineName}"
                    });
                }

                context.MedicineInventoryEntries.AddRange(inventoryEntries);
                await context.SaveChangesAsync();
            }

            if (!context.LaboratoryTests.Any())
            {
                var tests = new List<LaboratoryTest>
                {
                    new LaboratoryTest { Name = "Complete Blood Count (CBC)", Description = "Measures overall health and detects disorders", Price = 50 },
                    new LaboratoryTest { Name = "Basic Metabolic Panel (BMP)", Description = "Measures glucose, calcium, and electrolytes", Price = 70 },
                    new LaboratoryTest { Name = "Comprehensive Metabolic Panel (CMP)", Description = "Evaluates liver and kidney function", Price = 90 },
                    new LaboratoryTest { Name = "Lipid Panel", Description = "Measures cholesterol and triglycerides", Price = 80 },
                    new LaboratoryTest { Name = "Liver Function Test", Description = "Assesses liver health", Price = 85 },
                    new LaboratoryTest { Name = "Thyroid Stimulating Hormone (TSH)", Description = "Evaluates thyroid gland function", Price = 65 },
                    new LaboratoryTest { Name = "Hemoglobin A1C", Description = "Average blood sugar levels over 3 months", Price = 60 },
                    new LaboratoryTest { Name = "Urinalysis", Description = "Detects infections or kidney disease", Price = 40 },
                    new LaboratoryTest { Name = "Prothrombin Time (PT)", Description = "Measures blood clotting", Price = 55 },
                    new LaboratoryTest { Name = "Blood Culture", Description = "Detects infections in the blood", Price = 100 },
                    new LaboratoryTest { Name = "Electrolyte Panel", Description = "Measures sodium, potassium, and chloride levels", Price = 50 },
                    new LaboratoryTest { Name = "Vitamin D Test", Description = "Measures vitamin D levels", Price = 75 },
                    new LaboratoryTest { Name = "C-Reactive Protein (CRP)", Description = "Detects inflammation", Price = 70 },
                    new LaboratoryTest { Name = "Erythrocyte Sedimentation Rate (ESR)", Description = "Detects inflammation in the body", Price = 45 },
                    new LaboratoryTest { Name = "Ferritin", Description = "Measures iron storage levels", Price = 65 },
                    new LaboratoryTest { Name = "Folate Test", Description = "Measures folic acid levels", Price = 60 },
                    new LaboratoryTest { Name = "Vitamin B12 Test", Description = "Measures vitamin B12 levels", Price = 60 },
                    new LaboratoryTest { Name = "Hepatitis B Surface Antigen", Description = "Detects hepatitis B virus", Price = 90 },
                    new LaboratoryTest { Name = "HIV Test", Description = "Detects HIV infection", Price = 120 },
                    new LaboratoryTest { Name = "COVID-19 PCR Test", Description = "Detects active COVID-19 infection", Price = 150 },
                    new LaboratoryTest { Name = "Pregnancy Test (hCG)", Description = "Detects pregnancy hormone", Price = 35 },
                    new LaboratoryTest { Name = "Pap Smear", Description = "Cervical cancer screening", Price = 80 },
                    new LaboratoryTest { Name = "PSA Test", Description = "Detects prostate issues", Price = 85 },
                    new LaboratoryTest { Name = "Chest X-Ray", Description = "Imaging for lungs and chest", Price = 100 },
                    new LaboratoryTest { Name = "MRI Brain", Description = "Detailed imaging of the brain", Price = 500 },
                    new LaboratoryTest { Name = "CT Abdomen", Description = "Detailed imaging of the abdomen", Price = 400 },
                    new LaboratoryTest { Name = "Abdominal Ultrasound", Description = "Ultrasound imaging of abdomen organs", Price = 120 },
                    new LaboratoryTest { Name = "ECG (Electrocardiogram)", Description = "Measures heart electrical activity", Price = 60 },
                    new LaboratoryTest { Name = "Spirometry", Description = "Measures lung function", Price = 70 },
                    new LaboratoryTest { Name = "Allergy Panel", Description = "Tests for common allergens", Price = 110 }
                };

                context.LaboratoryTests.AddRange(tests);
                await context.SaveChangesAsync();
            }

            if (!context.Appointments.Any())
            {
                var random = new Random();

                // Lấy UserId của user role "User"
                var userRoleUsers = await userManager.GetUsersInRoleAsync("User");
                var userIds = userRoleUsers.Select(u => u.Id).ToList();

                // Lấy DoctorId (UserId của user role "Doctor" => map sang Doctor)
                var doctorRoleUsers = await userManager.GetUsersInRoleAsync("Doctor");
                var doctorUserIds = doctorRoleUsers.Select(u => u.Id).ToList();

                var doctors = await context.Doctors
                    .Where(d => doctorUserIds.Contains(d.UserId))
                    .ToListAsync();

                var appointments = new List<Appointment>();

                for (int i = 0; i < 50; i++)
                {
                    var randomUserId = userIds[random.Next(userIds.Count)];
                    var randomDoctor = doctors[random.Next(doctors.Count)];

                    var status = i < 10 ? AppointmentStatus.Booked
                               : i < 20 ? AppointmentStatus.Pending
                               : AppointmentStatus.Examined;

                    var startTime = DateTime.Now.AddDays(-random.Next(0, 30)).AddHours(random.Next(8, 17));
                    var endTime = startTime.AddMinutes(30);

                    appointments.Add(new Appointment
                    {
                        BookByUserID = randomUserId,
                        DoctorId = randomDoctor.Id,
                        StartTime = startTime,
                        EndTime = endTime,
                        AppointmentStatus = status,
                        Price = Constants.MedicalFee
                    });
                }

                context.Appointments.AddRange(appointments);
                await context.SaveChangesAsync();
            }

            if (!context.MedicalHistories.Any())
            {
                var appointments = await context.Appointments
                    .Where(a => a.AppointmentStatus == AppointmentStatus.Pending || a.AppointmentStatus == AppointmentStatus.Examined)
                    .ToListAsync();

                foreach (var appointment in appointments)
                {
                    var medicalHistory = new MedicalHistory
                    {
                        DoctorId = appointment.DoctorId,
                        PatientId = appointment.BookByUserID,
                        TotalAmount = Constants.MedicalFee
                    };

                    if (appointment.AppointmentStatus == AppointmentStatus.Examined)
                    {
                        medicalHistory.Symptoms = "Fever, cough, and sore throat";
                        medicalHistory.Diagnosis = "Upper respiratory tract infection";
                        medicalHistory.TreatmentInstructions = "Take paracetamol every 6 hours, drink plenty of fluids, and rest";
                    }
                    else // Pending
                    {
                        medicalHistory.Symptoms = null;
                        medicalHistory.Diagnosis = null;
                        medicalHistory.TreatmentInstructions = null;
                    }

                    context.MedicalHistories.Add(medicalHistory);
                    await context.SaveChangesAsync();

                    // Gán lại MedicalHistoryId cho Appointment
                    appointment.MedicalHistoryId = medicalHistory.MedicalHistoryId;
                    context.Appointments.Update(appointment);
                    await context.SaveChangesAsync();
                }
            }

            if (!context.LaboratoryTestReports.Any())
            {
                var random = new Random();


                var medicalHistories = await context.MedicalHistories
                     .Take(30)
                     .ToListAsync();

                // Lấy các test
                var labTests = await context.LaboratoryTests.ToListAsync();

                // Lấy technician user id
                var technicians = await userManager.GetUsersInRoleAsync("Staff");
                var technicianIds = technicians.Select(t => t.Id).ToList();

                var reports = new List<LaboratoryTestReport>();

                foreach (var mh in medicalHistories)
                {
                    var testCount = random.Next(1, 4);
                    var randomTests = labTests.OrderBy(_ => Guid.NewGuid()).Take(testCount).ToList();

                    foreach (var test in randomTests)
                    {
                        var report = new LaboratoryTestReport
                        {
                            MedicalHistoryId = mh.MedicalHistoryId,
                            LaboratoryTestId = test.LaboratoryTestId,
                            TechnicianId = technicianIds[random.Next(technicianIds.Count)],
                            Result = $"Result for {test.Name}: {(random.NextDouble() * 100).ToString("F2")}",
                            Created = DateTime.Now.AddDays(-random.Next(1, 30)),
                            Images = new List<Image>() // Có thể thêm image nếu cần seed luôn
                        };

                        reports.Add(report);
                    }
                }

                context.LaboratoryTestReports.AddRange(reports);
                await context.SaveChangesAsync();
            }

            if (!context.Prescriptions.Any())
            {
                var random = new Random();

                var medicalHistories = await context.MedicalHistories.ToListAsync();
                var medicines = await context.Medicines.ToListAsync();

                var prescriptions = new List<Prescription>();
                var prescriptionDetails = new List<PrescriptionDetail>();
                var inventoryEntries = new List<MedicineInventoryEntry>();

                foreach (var history in medicalHistories)
                {
                    var prescription = new Prescription
                    {
                        MedicalHistoryID = history.MedicalHistoryId,
                        Created = DateTime.Now,
                        TotalAmount = 0
                    };

                    prescriptions.Add(prescription);
                    context.Prescriptions.Add(prescription);
                    await context.SaveChangesAsync(); // Có PrescriptionID

                    var detailCount = random.Next(5, 11);
                    var usedMedicineIds = new HashSet<int>();
                    decimal totalAmount = 0;

                    for (int i = 0; i < detailCount; i++)
                    {
                        Medicine med;
                        do
                        {
                            med = medicines[random.Next(medicines.Count)];
                        }
                        while (usedMedicineIds.Contains(med.MedicineID));

                        usedMedicineIds.Add(med.MedicineID);

                        var qty = random.Next(1, 6);
                        var amount = qty * med.UnitPrice;

                        var detail = new PrescriptionDetail
                        {
                            PrescriptionID = prescription.PrescriptionID,
                            MedicineID = med.MedicineID,
                            Quantity = qty,
                            Amount = amount,
                            Usage = "Take after meal"
                        };

                        prescriptionDetails.Add(detail);
                        totalAmount += amount;

                        // Tạo MedicineInventoryEntry tương ứng
                        var inventoryEntry = new MedicineInventoryEntry
                        {
                            MedicineID = med.MedicineID,
                            ChangeType = ChangeType.Used,
                            Quantity = qty,
                            Timestamp = DateTime.Now,
                            CompanyName = "",
                            Note = $"Used for prescription {prescription.PrescriptionID}",
                            PrescriptionID = prescription.PrescriptionID
                        };

                        inventoryEntries.Add(inventoryEntry);
                    }

                    prescription.TotalAmount = totalAmount;
                    context.Prescriptions.Update(prescription);
                }

                context.PrescriptionDetails.AddRange(prescriptionDetails);
                context.MedicineInventoryEntries.AddRange(inventoryEntries);
                await context.SaveChangesAsync();
            }

            {
                // Lấy toàn bộ thuốc
                var medicines = await context.Medicines.ToListAsync();

                // Lấy toàn bộ entry
                var inventoryEntries = await context.MedicineInventoryEntries.ToListAsync();

                // Group theo MedicineID và tính tồn kho
                var inventoryByMedicine = inventoryEntries
                    .GroupBy(e => e.MedicineID)
                    .Select(g => new
                    {
                        MedicineID = g.Key,
                        Stock = g.Sum(e =>
                            e.ChangeType == ChangeType.Inbound || e.ChangeType == ChangeType.Return
                                ? e.Quantity
                                : -e.Quantity)
                    })
                    .ToList();

                // Update từng medicine
                foreach (var med in medicines)
                {
                    var stock = inventoryByMedicine
                        .FirstOrDefault(x => x.MedicineID == med.MedicineID)?.Stock ?? 0;

                    med.Quantity = stock;
                    context.Medicines.Update(med);
                }

                await context.SaveChangesAsync();

            }
            {
                var medicalHistories = await context.MedicalHistories.ToListAsync();

                var appointments = await context.Appointments
                    .Where(a => medicalHistories.Select(mh => mh.MedicalHistoryId).Contains(a.MedicalHistoryId ?? 0))
                    .ToListAsync();

                var prescriptions = await context.Prescriptions
                    .Where(p => medicalHistories.Select(mh => mh.MedicalHistoryId).Contains(p.MedicalHistoryID))
                    .ToListAsync();

                var labReports = await context.LaboratoryTestReports
                    .Where(r => medicalHistories.Select(mh => mh.MedicalHistoryId).Contains(r.MedicalHistoryId))
                    .ToListAsync();

                var labTests = await context.LaboratoryTests.ToListAsync();

                foreach (var mh in medicalHistories)
                {
                    decimal? totalAmount = 0;

                    var appointment = appointments.FirstOrDefault(a => a.MedicalHistoryId == mh.MedicalHistoryId);
                    if (appointment != null)
                        totalAmount += appointment.Price;

                    var prescription = prescriptions.FirstOrDefault(p => p.MedicalHistoryID == mh.MedicalHistoryId);
                    if (prescription != null)
                        totalAmount += prescription.TotalAmount;

                    var reports = labReports.Where(r => r.MedicalHistoryId == mh.MedicalHistoryId).ToList();
                    foreach (var report in reports)
                    {
                        var labTest = labTests.FirstOrDefault(lt => lt.LaboratoryTestId == report.LaboratoryTestId);
                        if (labTest != null)
                            totalAmount += labTest.Price;
                    }


                    mh.TotalAmount = totalAmount ?? 0m;
                    context.MedicalHistories.Update(mh);
                }
                await context.SaveChangesAsync();
            }
            if (!context.Transactions.Any())
            {
                var random = new Random();

                var medicalHistories = await context.MedicalHistories.ToListAsync();
                var transactions = new List<Transaction>();

                foreach (var mh in medicalHistories)
                {
                    if (mh.TotalAmount > 0)
                    {
                        // Random PaidDate trong 3 tháng gần đây
                        var paidDate = DateTime.Now.AddDays(-random.Next(0, 90));

                        var transaction = new Transaction
                        {
                            MedicalHistoryId = mh.MedicalHistoryId,
                            PaymentType = (PaymentType)random.Next(0, 3),  // Cash, Card, BankTransfer
                            Paid = true,
                            PaidDate = paidDate,
                            Created = paidDate  // Created = PaidDate
                        };

                        transactions.Add(transaction);
                    }
                }

                context.Transactions.AddRange(transactions);
                await context.SaveChangesAsync();
            }

            if (!context.RevenueReports.Any())
            {
                var transactions = await context.Transactions
                    .Where(t => t.Paid && t.PaidDate.HasValue)
                    .ToListAsync();

                var reports = new List<RevenueReport>();

                // GROUP THEO THÁNG
                var monthlyGroups = transactions
                    .GroupBy(t => new { t.PaidDate.Value.Year, t.PaidDate.Value.Month });

                foreach (var group in monthlyGroups)
                {
                    var fromDate = new DateTime(group.Key.Year, group.Key.Month, 1);
                    var toDate = fromDate.AddMonths(1).AddDays(-1);

                    reports.Add(new RevenueReport
                    {
                        RevenueType = RevenueType.Monthly,
                        FromDate = fromDate,
                        ToDate = toDate,
                        RevenueAmount = group.Sum(t => t.MedicalHistory.TotalAmount),
                    });
                }

                // GROUP THEO TUẦN
                var weeklyGroups = transactions
                    .GroupBy(t =>
                        System.Globalization.CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(
                            t.PaidDate.Value,
                            System.Globalization.CalendarWeekRule.FirstDay,
                            DayOfWeek.Monday
                        )
                    );

                foreach (var group in weeklyGroups)
                {
                    var firstDate = group.Min(t => t.PaidDate.Value);
                    var lastDate = group.Max(t => t.PaidDate.Value);

                    reports.Add(new RevenueReport
                    {
                        RevenueType = RevenueType.WeekLy,
                        FromDate = firstDate.Date,
                        ToDate = lastDate.Date,
                        RevenueAmount = group.Sum(t => t.MedicalHistory.TotalAmount),
                    });
                }

                // GROUP THEO QUÝ
                var quarterlyGroups = transactions
                    .GroupBy(t => new
                    {
                        t.PaidDate.Value.Year,
                        Quarter = (t.PaidDate.Value.Month - 1) / 3 + 1
                    });

                foreach (var group in quarterlyGroups)
                {
                    var year = group.Key.Year;
                    var quarter = group.Key.Quarter;
                    var fromDate = new DateTime(year, (quarter - 1) * 3 + 1, 1);
                    var toDate = fromDate.AddMonths(3).AddDays(-1);

                    reports.Add(new RevenueReport
                    {
                        RevenueType = RevenueType.Quartertly,
                        FromDate = fromDate,
                        ToDate = toDate,
                        RevenueAmount = group.Sum(t => t.MedicalHistory.TotalAmount),
                    });
                }

                // GROUP THEO NĂM
                var yearlyGroups = transactions
                    .GroupBy(t => t.PaidDate.Value.Year);

                foreach (var group in yearlyGroups)
                {
                    var year = group.Key;
                    var fromDate = new DateTime(year, 1, 1);
                    var toDate = new DateTime(year, 12, 31);

                    reports.Add(new RevenueReport
                    {
                        RevenueType = RevenueType.Yearly,
                        FromDate = fromDate,
                        ToDate = toDate,
                        RevenueAmount = group.Sum(t => t.MedicalHistory.TotalAmount),
                    });
                }

                context.RevenueReports.AddRange(reports);
                await context.SaveChangesAsync();
            }

        }
    }
}
