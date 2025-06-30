FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
#create folder save source code
WORKDIR /app
EXPOSE 80
ENV ASPNETCORE_URLS=http://+:80

#build stage build để tạo thư mục build các dependencies
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

#copy file csproj qua src docker
COPY ClinicBooking/ClinicBooking.csproj ClinicBooking/
#copy source từ project Utility qua docker
COPY ClinicBooking_Utility/ClinicBooking_Utility.csproj ClinicBooking_Utility/

#đảm bảo dependency được install trước khi build project
RUN dotnet restore "ClinicBooking/ClinicBooking.csproj"

#copy source code từ local qua docker
COPY ClinicBooking/. ClinicBooking/
COPY ClinicBooking_Utility/. ClinicBooking_Utility/

#build app
# WORKDIR "/src/ClinicBooking"
# RUN dotnet build "ClinicBooking.csproj" -c Release -o /app/build

#publish app để deploy
WORKDIR /src/ClinicBooking
RUN dotnet publish "ClinicBooking.csproj" -c Release -o /app/publish /p:UseAppHost=false

#final stage
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ClinicBooking.dll"]