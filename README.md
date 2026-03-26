# badge_2026

The general repository for the Fri3d Camp 2026 badge. Access the documentation here: https://fri3dcamp.github.io/badge_2026/

Documentation is written using [mkdocs](https://www.mkdocs.org/). You can find the source pages in the [docs](docs) folder.

Something missing? Please open [an issue](https://github.com/fri3dcamp/badge_2026/issues/new) or a [pull request](https://github.com/fri3dcamp/badge_2026/compare).

# View docs locally

To check your changes locally, it is advised to use a virtual environment such as [venv](https://docs.python.org/3/library/venv.html).

Create a virtual environment with:

```bash
python -m venv .venv
```

Then activate it with:

```bash
source .venv/bin/activate
```

Install the dependencies with:

```bash
pip install -r requirements.txt
```

Start the local server with:

```bash
mkdocs serve
```

The documentation will then be available at http://127.0.0.1:8000/badge_2026/
