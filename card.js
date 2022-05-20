class Card extends HTMLElement {
    constructor() {
      super();
  
      this.tokenName = "";
      this.tokenTicker = "";
    }
  
    connectedCallback() {
      this.tokenName = this.getAttribute("tokenName");
      this.tokenTicker = this.getAttribute("tokenTicker");
  
      this.render();
    }
  

  render() {
    this.innerHTML = `
    <div class="col">
    <div class="card gradient-box">
            <div class="card-body" style="padding-bottom:0;">
                            <div class="row align-items-center">
                            <div class="col" style="max-width:52px;margin-right:10px;">
                                <img class="pull-left" style="display:inline-block;width:48px;" src="images/${this.tokenTicker}.svg" alt="${this.tokenName}">
                            </div>
                            <div class="col">
                                <h3 class="card-title" style="margin-bottom:0;">${this.tokenTicker}</h3>
                                <span class="text-secondary"><small>${this.tokenName}</small></span>
                            </div>
                            <div class="col">

                                <!-- PRICE IN $ -->
                                <p class="card-text text-end text-secondary">1 ${this.tokenTicker} = <span id="price-${this.tokenTicker}">$0.00</span></p>
                            </div>
                            </div>

                            <hr>

                        </div>
                        <div class="card-body text-center" style="padding-top:0;">

                            <div class="row justify-content-center">
                            <div class="col text-end" style="padding-right:0;">
                                <p><strong>Your Balance:</strong></p>
                            </div>
                            <div class="col text-start" style="padding-left:8px;">
                                <!-- BALANCE -->
                                <p><span id="balance-${this.tokenTicker}">0.00</span> ${this.tokenTicker}</p>
                            </div>
                            </div>

                            <p>
                            <a href="javascript:void(0);" id="btn-buy${this.tokenTicker}" style="margin-right:0;" class="btn btn-primary btn-sm">BUY ${this.tokenTicker}</a>
                            <a href="javascript:void(0);" id="btn-faucet${this.tokenTicker}" class="btn btn-primary btn-sm">GET FAUCET ${this.tokenTicker}</a>
                            </p>

                            <hr>

                            <div class="row justify-content-center"  style="min-height:120px">
                            <div class="col text-end" style="padding-right:0;">
                                <p><strong>APY:</strong></p>
                                <p><strong>Your Supply:</strong></p>
                            </div>
                            <div class="col text-start" style="padding-left:8px;">

                                <!-- APY, SUPPLY & EARNINGS -->
                                <p><span id="interest-${this.tokenTicker}">-%</span></p>
                                <p><span id="deposited-${this.tokenTicker}">0.00</span> ${this.tokenTicker}</p>
                            </div>
                            </div>

                            <p>
                            <div class="input-group">
                                <span class="input-group-text"><small><b>WBTC</b></small></span>

                                <!-- - AMOUNT, APPROVE, SUPPLY & WITHDRAW -->
                                <input id="amount-${this.tokenTicker}" type="text" class="form-control" placeholder="Amount" aria-label="Amount">
                                <button id="btn-approve${this.tokenTicker}" class="btn btn-warning btn-sm" style="padding-right:12px;padding-left:12px;" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Approve"><i class="bi bi-check-circle"></i></button>
                                <button id="btn-supply${this.tokenTicker}" class="btn btn-success btn-sm" style="padding-right:12px;padding-left:12px;" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Supply"><i class="bi bi-plus-circle"></i></button>
                                <button id="btn-withdraw${this.tokenTicker}" class="btn btn-danger btn-sm" style="padding-right:12px;padding-left:12px;" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Withdraw"><i class="bi bi-dash-circle"></i></button>
                            </div>
                            </p>

                            <a tabindex="0" class="card-link popover-dismiss-2 text-decoration-none" role="button" data-bs-toggle="popover" data-bs-trigger="focus" title="Dismissible popover" data-bs-content="And here's some amazing content. It's very engaging. Right?"><i class="bi bi-info-circle"></i> How does it work?</a>
                        </div>
                        </div>
                        </div>

            `;
    }
 
}

customElements.define("t-card", Card);