# using to host local server
from flask import Flask, render_template, request

app = Flask(__name__)
app.config['SECRET_KEY'] = 'd42c51f24733b869a5916a8c09043624'


@app.route('/', methods=['GET', 'POST'])
def run():
    print(request.args.get('counter'))    
    return render_template('index.html')



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)