import sys

def exception_message_detail_info(error, execption_message:sys):
    _,_,exc_tb = execption_message.exc_info()
    file_name = exc_tb.tb_frame.f_code.co_filename
    error_message=f"Error has occur in file {[0]} in line number{[1]} and error messsage is {[2]}".format(
        file_name, exc_tb.tb_lineno, str(error)
    
    )
    return error_message

class CustomException(Exception):
    def __init__(self, error_message, execption_message:sys):
        super.__init__(error_message)
        self.error_message = exception_message_detail_info(error_message, execption_message=execption_message)
    
    def __str__(self):
        return self.error_message
    