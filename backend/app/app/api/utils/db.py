from starlette.requests import Request


# TODO: Check this version
def get_db(request: Request):
    return request.state.db
