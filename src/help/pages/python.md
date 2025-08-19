# Python & pyenv

Sigao installs Python via pyenv for version management and includes essential development tools.

## pyenv Basics

```bash
# List installed versions
pyenv versions

# List available versions
pyenv install --list

# Install specific version
pyenv install 3.11.7
pyenv install 3.12.0

# Set global version
pyenv global 3.11.7

# Set local version (project)
pyenv local 3.11.7  # Creates .python-version

# Set shell version (temporary)
pyenv shell 3.11.7
```

## Python Aliases

| Alias | Command | Description |
|-------|---------|-------------|
| `py` | `python3` | Python 3 |
| `pip` | `pip3` | Pip 3 |
| `venv` | `python3 -m venv` | Create virtualenv |
| `activate` | `source venv/bin/activate` | Activate venv |

## Virtual Environments

### Using venv
```bash
# Create virtual environment
venv .venv
# or
python -m venv .venv

# Activate
source .venv/bin/activate
# or use alias
activate  # if .venv exists

# Deactivate
deactivate

# Remove
rm -rf .venv
```

### Using pyenv-virtualenv
```bash
# Create virtualenv
pyenv virtualenv 3.11.7 myproject

# List virtualenvs
pyenv virtualenvs

# Activate
pyenv activate myproject

# Auto-activate in directory
pyenv local myproject

# Delete virtualenv
pyenv virtualenv-delete myproject
```

## Python Development Tools

Sigao installs via pipx:

### Black (Formatter)
```bash
# Format file
black script.py

# Format directory
black .

# Check without changing
black --check .

# Configuration in pyproject.toml
[tool.black]
line-length = 88
target-version = ['py311']
```

### Ruff (Linter)
```bash
# Lint files
ruff check .

# Fix auto-fixable issues
ruff check --fix .

# Watch mode
ruff check --watch .

# Configuration
[tool.ruff]
line-length = 88
select = ["E", "F", "I"]
```

### mypy (Type Checker)
```bash
# Type check
mypy script.py
mypy .

# Strict mode
mypy --strict script.py

# Configuration
[mypy]
python_version = "3.11"
warn_return_any = true
warn_unused_configs = true
```

### pytest (Testing)
```bash
# Run tests
pytest

# Verbose output
pytest -v

# Run specific test
pytest tests/test_app.py::test_function

# Coverage
pytest --cov=myapp tests/
```

### IPython (Enhanced Shell)
```bash
# Start IPython
ipython

# Run script with IPython
ipython script.py

# Useful IPython commands:
%timeit  # Time execution
%debug   # Debug last exception
%run     # Run script
%load    # Load code
```

### Poetry (Dependency Management)
```bash
# Create new project
poetry new myproject

# Initialize in existing project
poetry init

# Add dependency
poetry add requests
poetry add --dev pytest

# Install dependencies
poetry install

# Run in virtualenv
poetry run python script.py
poetry run pytest

# Shell in virtualenv
poetry shell
```

## Package Management

### pip Commands
```bash
# Install package
pip install requests

# Install specific version
pip install django==4.2

# Install from requirements
pip install -r requirements.txt

# Install editable
pip install -e .

# Upgrade package
pip install --upgrade requests

# List installed
pip list
pip freeze > requirements.txt
```

### pipx (Global Tools)
```bash
# Install tool globally
pipx install black

# List installed
pipx list

# Upgrade
pipx upgrade black

# Upgrade all
pipx upgrade-all

# Uninstall
pipx uninstall black
```

## Project Structure

### Basic Layout
```
myproject/
├── src/
│   └── myproject/
│       ├── __init__.py
│       └── main.py
├── tests/
│   ├── __init__.py
│   └── test_main.py
├── .python-version
├── .gitignore
├── pyproject.toml
├── README.md
└── requirements.txt
```

### pyproject.toml
```toml
[build-system]
requires = ["setuptools", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "myproject"
version = "0.1.0"
description = "My awesome project"
dependencies = [
    "requests>=2.28",
    "click>=8.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0",
    "black>=23.0",
    "ruff>=0.1",
    "mypy>=1.0",
]
```

## Environment with direnv

Create `.envrc`:
```bash
# Use pyenv
use python 3.11.7

# Or layout
layout python

# Environment variables
export FLASK_APP=app.py
export FLASK_ENV=development
export PYTHONPATH=$PWD/src:$PYTHONPATH

# Add scripts to PATH
PATH_add scripts
```

## Common Workflows

### New Project
```bash
# Create directory
mkcd awesome-project

# Set Python version
pyenv local 3.11.7

# Initialize project
poetry init  # or manually create files

# Create virtualenv
venv .venv && activate

# Install dev tools
pip install black ruff mypy pytest

# Start coding!
```

### Flask App
```bash
# Install Flask
pip install flask

# Basic app.py
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return "Hello World!"

# Run
export FLASK_APP=app.py
flask run
```

### Data Science
```bash
# Create environment
pyenv virtualenv 3.11.7 datascience
pyenv activate datascience

# Install packages
pip install numpy pandas matplotlib jupyter

# Start Jupyter
jupyter notebook
```

## Debugging

### pdb (Python Debugger)
```python
# Add breakpoint
import pdb; pdb.set_trace()

# Or in Python 3.7+
breakpoint()
```

### IPython Debugging
```python
# In IPython
%debug  # Debug last exception
%pdb    # Auto-debug on exception
```

## Performance

### Profiling
```bash
# cProfile
python -m cProfile script.py

# With sorting
python -m cProfile -s cumulative script.py
```

### Timing
```python
# In IPython
%timeit function()

# In code
import timeit
timeit.timeit('function()', number=1000)
```

## Tips & Tricks

1. **Always use virtual environments**
2. **Pin dependencies**: Use exact versions
3. **Type hints**: Modern Python should use types
4. **Format on save**: Configure editor to run black
5. **Pre-commit hooks**: Auto-format and lint

## Troubleshooting

### pyenv Issues
```bash
# Rebuild Python
pyenv install 3.11.7 --force

# Update pyenv
cd ~/.pyenv && git pull

# Check shims
pyenv rehash
```

### pip Issues
```bash
# Upgrade pip
pip install --upgrade pip

# Clear cache
pip cache purge

# Install with no cache
pip install --no-cache-dir package
```

## See Also

- `sigao help direnv` - Auto-activate environments
- `sigao help aliases` - Python aliases
- pyenv docs: https://github.com/pyenv/pyenv
- Poetry docs: https://python-poetry.org/