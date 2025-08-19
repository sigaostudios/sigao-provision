# .NET SDK - Cross-Platform Development Framework

Microsoft's .NET SDK for building applications across platforms.

## Usage

```bash
# Create new projects
dotnet new console -n MyApp
dotnet new webapi -n MyAPI
dotnet new blazor -n MyBlazor

# Build and run
dotnet build
dotnet run
dotnet watch

# Package management
dotnet add package Newtonsoft.Json
dotnet restore
```

## Description

The .NET SDK provides a complete development platform for building applications using C#, F#, and Visual Basic. Sigao installs the latest LTS version to `~/.dotnet` with proper environment configuration.

## Installation Details

Sigao installs .NET SDK to:
- Location: `~/.dotnet`
- Environment: `DOTNET_ROOT` set automatically
- Telemetry: Disabled by default (`DOTNET_CLI_TELEMETRY_OPTOUT=1`)
- PATH: Updated to include dotnet tools

## Examples

### Create Console Application
```bash
# Create new console app
dotnet new console -n HelloWorld
cd HelloWorld

# Run the application
dotnet run
```

### Create Web API
```bash
# Create new web API
dotnet new webapi -n TodoAPI
cd TodoAPI

# Run with hot reload
dotnet watch run
```

### Add NuGet Packages
```bash
# Add popular packages
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Serilog
dotnet add package AutoMapper
```

### Global Tools
```bash
# Install global tools
dotnet tool install -g dotnet-ef
dotnet tool install -g dotnet-format

# List installed tools
dotnet tool list -g
```

## Project Templates

Common templates available:
- `console` - Console application
- `classlib` - Class library
- `webapi` - ASP.NET Core Web API
- `mvc` - ASP.NET Core MVC
- `blazor` - Blazor Web App
- `razor` - Razor Pages
- `worker` - Worker Service
- `grpc` - gRPC Service

List all templates:
```bash
dotnet new list
```

## Development Workflow

### Basic Workflow
```bash
# Create project
dotnet new webapi -n MyAPI

# Add packages
dotnet add package Microsoft.AspNetCore.OpenApi

# Build
dotnet build

# Run tests
dotnet test

# Publish
dotnet publish -c Release
```

### Hot Reload Development
```bash
# Watch for changes and restart
dotnet watch run

# With specific launch profile
dotnet watch run --launch-profile Development
```

## Configuration

### Environment Variables
```bash
# Set by Sigao
export DOTNET_ROOT="$HOME/.dotnet"
export PATH="$DOTNET_ROOT:$PATH"
export DOTNET_CLI_TELEMETRY_OPTOUT=1
```

### Global.json
```json
{
  "sdk": {
    "version": "8.0.100",
    "rollForward": "latestMinor"
  }
}
```

## Common Commands

### Project Management
```bash
# Create solution
dotnet new sln -n MySolution

# Add projects to solution
dotnet sln add src/MyApp/MyApp.csproj

# List projects in solution
dotnet sln list
```

### Testing
```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run specific test
dotnet test --filter "FullyQualifiedName~MyTest"
```

### Publishing
```bash
# Publish self-contained
dotnet publish -c Release -r linux-x64 --self-contained

# Publish framework-dependent
dotnet publish -c Release

# Single file executable
dotnet publish -c Release -r linux-x64 -p:PublishSingleFile=true
```

## Tips & Tricks

### Performance
```bash
# AOT compilation
dotnet publish -c Release -r linux-x64 -p:PublishAot=true

# Trimming
dotnet publish -c Release -r linux-x64 -p:PublishTrimmed=true
```

### Debugging
```bash
# Enable detailed MSBuild output
dotnet build -v detailed

# Generate binlog
dotnet build -bl
```

## Related Commands

- `docker` - Containerize .NET applications
- `azure` - Deploy to Azure
- `git` - Version control

## See Also

- .NET Documentation: https://docs.microsoft.com/dotnet/
- `sigao help docker` - Containerization
- `sigao help azure` - Azure CLI